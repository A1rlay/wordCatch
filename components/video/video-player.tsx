"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/app/providers";
import type { QuizSubmission, VideoLesson } from "@/server/data/learning";

// ─── YouTube IFrame API types ─────────────────────────────────────────────────

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  pauseVideo(): void;
  playVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  destroy(): void;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/,
  );
  return match?.[1] ?? null;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── State types ──────────────────────────────────────────────────────────────

type PlayerPhase = "idle" | "playing" | "paused" | "checkpoint" | "done";
type QuizPhase = "answering" | "submitting" | "results";

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoPlayer({ video }: { video: VideoLesson }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const checkpointFiredRef = useRef(false);
  const playerPhaseRef = useRef<PlayerPhase>("idle");

  const [playerPhase, setPlayerPhase] = useState<PlayerPhase>("idle");
  const [quizPhase, setQuizPhase] = useState<QuizPhase>("answering");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(video.durationSeconds);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);

  const videoId = extractYouTubeId(video.videoUrl);

  const trpc = useTRPC();
  const submitMutation = useMutation({
    ...trpc.video.submitQuiz.mutationOptions(),
  });

  function setPhase(phase: PlayerPhase) {
    playerPhaseRef.current = phase;
    setPlayerPhase(phase);
  }

  function startPolling() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      const time = player.getCurrentTime();
      const dur = player.getDuration();
      setCurrentTime(time);
      if (dur > 0) setDuration(dur);

      if (!checkpointFiredRef.current && time >= video.checkpointSeconds) {
        checkpointFiredRef.current = true;
        clearInterval(intervalRef.current!);
        player.pauseVideo();
        setPhase("checkpoint");
        setQuizPhase("answering");
      }
    }, 500);
  }

  function stopPolling() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    function createPlayer() {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId!,
        playerVars: { modestbranding: 1, rel: 0 },
        events: {
          onStateChange: (e) => {
            const YTState = window.YT.PlayerState;
            if (e.data === YTState.PLAYING) {
              setPhase("playing");
              startPolling();
            } else if (e.data === YTState.PAUSED) {
              stopPolling();
              if (playerPhaseRef.current !== "checkpoint") setPhase("paused");
            } else if (e.data === YTState.ENDED) {
              stopPolling();
              setPhase("done");
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    }

    return () => {
      stopPolling();
      playerRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  function handleRelisten() {
    checkpointFiredRef.current = false;
    playerRef.current?.seekTo(Math.max(0, video.checkpointSeconds - 10), true);
    playerRef.current?.playVideo();
    setPhase("playing");
  }

  function handleSubmit() {
    const answerList = Object.entries(answers).map(([questionId, optionId]) => ({
      optionId,
      questionId,
    }));
    setQuizPhase("submitting");
    submitMutation.mutate(
      {
        answers: answerList,
        topicSlug: video.topic.slug,
        videoSlug: video.slug,
      },
      {
        onSuccess: (data) => {
          setSubmission(data);
          setQuizPhase("results");
        },
        onError: () => setQuizPhase("answering"),
      },
    );
  }

  function handleContinue() {
    playerRef.current?.playVideo();
    setPhase("playing");
  }

  const allAnswered =
    video.questions.length > 0 && video.questions.every((q) => q.id in answers);

  const progressPct =
    duration && duration > 0 ? Math.min(100, (currentTime / duration) * 100) : null;

  if (!videoId) {
    return (
      <div className="mt-8 rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.76)] p-6 text-sm text-[var(--muted)]">
        Invalid video URL — please update the URL in the admin panel.
      </div>
    );
  }

  return (
    <>
      {/* YouTube iframe */}
      <div className="mt-8 overflow-hidden rounded-[28px] border border-[var(--border)] bg-black">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        </div>
      </div>

      {/* Controls bar */}
      <div className="mt-4 rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.76)] px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            {playerPhase === "idle" && "Press play in the video above to start"}
            {playerPhase === "playing" && "Listening…"}
            {playerPhase === "paused" && "Paused"}
            {playerPhase === "checkpoint" &&
              "Quiz time — answer the questions to continue"}
            {playerPhase === "done" && "Finished"}
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span>{formatTime(currentTime)}</span>
            {duration && duration > 0 && (
              <>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </>
            )}
          </div>
        </div>

        {progressPct !== null && (
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--foreground)] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
          <span className="rounded-full border border-[var(--border)] px-3 py-1">
            Checkpoint at {video.checkpointLabel}
          </span>
        </div>
      </div>

      {/* Checkpoint modal */}
      {playerPhase === "checkpoint" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[32px] border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(13,34,66,0.18)]">
            {quizPhase === "answering" && (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Checkpoint
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)]">
                  Quick check before you continue.
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Answer all {video.questions.length} questions, then keep watching.
                </p>

                <div className="mt-6 space-y-5">
                  {video.questions.map((question) => (
                    <fieldset
                      key={question.id}
                      className="rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-5"
                    >
                      <legend className="sr-only">Question {question.order}</legend>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                        Question {question.order}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                        {question.prompt}
                      </p>
                      <div className="mt-4 space-y-2">
                        {question.options.map((option) => {
                          const selected = answers[question.id] === option.id;
                          return (
                            <label
                              key={option.id}
                              className={`flex cursor-pointer items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                                selected
                                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={option.id}
                                checked={selected}
                                onChange={() =>
                                  setAnswers((prev) => ({
                                    ...prev,
                                    [question.id]: option.id,
                                  }))
                                }
                                className="sr-only"
                              />
                              {option.text}
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className="rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    Submit answers
                  </button>
                  <button
                    onClick={handleRelisten}
                    className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--muted)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  >
                    Re-watch
                  </button>
                </div>
              </>
            )}

            {quizPhase === "submitting" && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--foreground)]" />
                <p className="text-sm text-[var(--muted)]">Checking your answers…</p>
              </div>
            )}

            {quizPhase === "results" && submission !== null && (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                  Results
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)]">
                  {submission.correctCount} of {submission.total} correct
                </h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {submission.correctCount === submission.total
                    ? "Perfect score! Keep watching."
                    : submission.correctCount >= Math.ceil(submission.total / 2)
                      ? "Good effort. Review the questions below."
                      : "Take another watch and try again."}
                </p>

                <div className="mt-6 space-y-4">
                  {video.questions.map((question) => {
                    const result = submission.results.find(
                      (r) => r.questionId === question.id,
                    );
                    const correct = result?.correct ?? false;
                    return (
                      <div
                        key={question.id}
                        className={`rounded-[20px] border p-5 ${
                          correct
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                          Question {question.order}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                          {question.prompt}
                        </p>
                        <div className="mt-3 space-y-1.5">
                          {question.options.map((option) => {
                            const isSelected =
                              result?.selectedOptionId === option.id;
                            const isCorrect =
                              result?.correctOptionId === option.id;
                            return (
                              <div
                                key={option.id}
                                className={`rounded-full border px-4 py-2 text-sm ${
                                  isCorrect
                                    ? "border-green-400 bg-green-100 text-green-800"
                                    : isSelected
                                      ? "border-red-400 bg-red-100 text-red-700 line-through"
                                      : "border-transparent text-[var(--muted)]"
                                }`}
                              >
                                {option.text}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleContinue}
                  className="mt-6 rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Continue watching
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
