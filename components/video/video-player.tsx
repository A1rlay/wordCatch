"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/app/providers";
import type { QuizQuestion, SingleAnswerResult, VideoLesson } from "@/server/data/learning";

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
type QuizPhase = "answering" | "submitting" | "result";

type SessionResult = {
  correct: boolean;
  correctOptionId: string | null;
  question: QuizQuestion;
  selectedOptionId: string;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoPlayer({ video }: { video: VideoLesson }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextCheckpointIdxRef = useRef(0);
  const activeCheckpointIdxRef = useRef<number | null>(null);
  const playerPhaseRef = useRef<PlayerPhase>("idle");

  const [playerPhase, setPlayerPhase] = useState<PlayerPhase>("idle");
  const [quizPhase, setQuizPhase] = useState<QuizPhase>("answering");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [result, setResult] = useState<SingleAnswerResult | null>(null);
  // Accumulates one entry per question (keyed by question id, last answer wins on re-watch)
  const [sessionResults, setSessionResults] = useState<Map<string, SessionResult>>(new Map());

  // Sort questions by checkpointSeconds so they trigger in chronological order
  const sortedQuestions = useMemo(
    () => [...video.questions].sort((a, b) => a.checkpointSeconds - b.checkpointSeconds),
    [video.questions],
  );

  const videoId = extractYouTubeId(video.videoUrl);

  const trpc = useTRPC();
  const submitMutation = useMutation({
    ...trpc.video.submitAnswer.mutationOptions(),
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

      const idx = nextCheckpointIdxRef.current;
      if (idx < sortedQuestions.length) {
        const checkpoint = sortedQuestions[idx];
        if (time >= checkpoint.checkpointSeconds) {
          nextCheckpointIdxRef.current = idx + 1;
          activeCheckpointIdxRef.current = idx;
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          player.pauseVideo();
          setPhase("checkpoint");
          setActiveQuestion(checkpoint);
          setSelectedOptionId(null);
          setResult(null);
          setQuizPhase("answering");
        }
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
    const idx = activeCheckpointIdxRef.current;
    const prevSeconds =
      idx !== null && idx > 0 ? sortedQuestions[idx - 1].checkpointSeconds : 0;
    // Roll back so this checkpoint fires again when we reach it
    nextCheckpointIdxRef.current = idx ?? 0;
    playerRef.current?.seekTo(prevSeconds, true);
    playerRef.current?.playVideo();
    setPhase("playing");
  }

  function handleSubmit() {
    if (!activeQuestion || !selectedOptionId) return;
    setQuizPhase("submitting");
    submitMutation.mutate(
      { optionId: selectedOptionId, questionId: activeQuestion.id },
      {
        onSuccess: (data) => {
          setResult(data);
          setQuizPhase("result");
          // Record result for end-of-video summary (last answer wins on re-watch)
          setSessionResults((prev) => {
            const next = new Map(prev);
            next.set(activeQuestion.id, {
              correct: data.correct,
              correctOptionId: data.correctOptionId,
              question: activeQuestion,
              selectedOptionId: selectedOptionId,
            });
            return next;
          });
        },
        onError: () => setQuizPhase("answering"),
      },
    );
  }

  function handleContinue() {
    if (nextCheckpointIdxRef.current >= sortedQuestions.length) {
      playerRef.current?.pauseVideo();
      setPhase("done");
    } else {
      playerRef.current?.playVideo();
      setPhase("playing");
    }
  }

  const progressPct =
    duration && duration > 0 ? Math.min(100, (currentTime / duration) * 100) : null;

  const completedCount = sessionResults.size;
  const totalQuestions = sortedQuestions.length;

  // Summary derived from sessionResults (sorted by question order)
  const summaryResults = useMemo(
    () =>
      [...sessionResults.values()].sort((a, b) => a.question.order - b.question.order),
    [sessionResults],
  );
  const correctCount = summaryResults.filter((r) => r.correct).length;
  const wrongCount = summaryResults.filter((r) => !r.correct).length;

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
      <div className="mt-3 rounded-2xl border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.1)] px-5 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[rgba(255,255,255,0.7)]">
            {playerPhase === "idle" && "Press play to start"}
            {playerPhase === "playing" && "Watching…"}
            {playerPhase === "paused" && "Paused"}
            {playerPhase === "checkpoint" && "Answer to continue"}
            {playerPhase === "done" && "Finished"}
          </p>
          <div className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.55)]">
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
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.15)]">
            <div
              className="h-full rounded-full bg-[#0F9C00] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        {totalQuestions > 0 && (
          <div className="mt-3 text-xs text-[rgba(255,255,255,0.55)]">
            {completedCount} / {totalQuestions} answered
          </div>
        )}
      </div>

      {/* Checkpoint modal */}
      {playerPhase === "checkpoint" && activeQuestion !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            {quizPhase === "answering" && (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F9C00]">
                  Question {activeQuestion.order}
                </p>
                <h2 className="mt-3 text-xl font-extrabold text-[#000D71]">
                  {activeQuestion.prompt}
                </h2>

                <div className="mt-5 space-y-2">
                  {activeQuestion.options.map((option) => {
                    const selected = selectedOptionId === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                          selected
                            ? "border-[#000D71] bg-[#000D71] text-white"
                            : "border-gray-200 text-gray-700 hover:border-[#000D71]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={option.id}
                          checked={selected}
                          onChange={() => setSelectedOptionId(option.id)}
                          className="sr-only"
                        />
                        {option.text}
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={selectedOptionId === null}
                    className="rounded-full bg-[#0F9C00] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleRelisten}
                    className="rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-gray-400"
                  >
                    Re-watch
                  </button>
                </div>
              </>
            )}

            {quizPhase === "submitting" && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0F9C00]" />
                <p className="text-sm text-gray-500">Checking…</p>
              </div>
            )}

            {quizPhase === "result" && result !== null && (
              <>
                <p className={`text-xs font-bold uppercase tracking-[0.28em] ${result.correct ? "text-[#0F9C00]" : "text-red-500"}`}>
                  {result.correct ? "Correct!" : "Wrong"}
                </p>
                <h2 className="mt-3 text-xl font-extrabold text-[#000D71]">
                  {activeQuestion.prompt}
                </h2>

                <div className="mt-5 space-y-2">
                  {activeQuestion.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = result.correctOptionId === option.id;
                    return (
                      <div
                        key={option.id}
                        className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${
                          isCorrect
                            ? "border-[#0F9C00] bg-green-50 text-[#0F9C00]"
                            : isSelected
                              ? "border-red-400 bg-red-50 text-red-600 line-through"
                              : "border-gray-100 text-gray-400"
                        }`}
                      >
                        {option.text}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleContinue}
                    className="rounded-full bg-[#0F9C00] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  >
                    Continue
                  </button>
                  <button
                    onClick={handleRelisten}
                    className="rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-gray-400"
                  >
                    Re-watch
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* End-of-video summary modal */}
      {playerPhase === "done" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F9C00]">
              Lesson complete
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-[#000D71]">
              {video.title}
            </h2>

            {summaryResults.length > 0 ? (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-green-50 p-4 text-center">
                    <p className="text-4xl font-extrabold text-[#0F9C00]">{correctCount}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[#0F9C00]">
                      Correct
                    </p>
                  </div>
                  <div className="rounded-2xl bg-red-50 p-4 text-center">
                    <p className="text-4xl font-extrabold text-red-500">{wrongCount}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-red-500">
                      Wrong
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {summaryResults.map(({ correct, correctOptionId, question, selectedOptionId: chosen }) => (
                    <div
                      key={question.id}
                      className={`rounded-2xl p-4 ${correct ? "bg-green-50" : "bg-red-50"}`}
                    >
                      <p className={`text-xs font-bold uppercase tracking-widest ${correct ? "text-[#0F9C00]" : "text-red-500"}`}>
                        Q{question.order}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#000D71]">
                        {question.prompt}
                      </p>
                      <div className="mt-3 space-y-1.5">
                        {question.options.map((option) => {
                          const isSelected = chosen === option.id;
                          const isCorrect = correctOptionId === option.id;
                          return (
                            <div
                              key={option.id}
                              className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold ${
                                isCorrect
                                  ? "border-[#0F9C00] bg-white text-[#0F9C00]"
                                  : isSelected
                                    ? "border-red-400 bg-white text-red-500 line-through"
                                    : "border-transparent text-gray-400"
                              }`}
                            >
                              {option.text}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-gray-400">
                No questions answered.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
