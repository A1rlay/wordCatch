"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/app/providers";
import type { AudioLesson, QuizSubmission } from "@/server/data/learning";

type PlayerPhase = "idle" | "playing" | "paused" | "checkpoint" | "done";
type QuizPhase = "answering" | "submitting" | "results";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function AudioPlayer({ audio }: { audio: AudioLesson }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const checkpointFiredRef = useRef(false);

  const [playerPhase, setPlayerPhase] = useState<PlayerPhase>("idle");
  const [quizPhase, setQuizPhase] = useState<QuizPhase>("answering");
  const [currentTime, setCurrentTime] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);

  const trpc = useTRPC();
  const submitMutation = useMutation({
    ...trpc.audio.submitQuiz.mutationOptions(),
  });

  function handleTimeUpdate() {
    const el = audioRef.current;
    if (!el) return;
    setCurrentTime(el.currentTime);
    if (
      !checkpointFiredRef.current &&
      el.currentTime >= audio.checkpointSeconds
    ) {
      checkpointFiredRef.current = true;
      el.pause();
      setPlayerPhase("checkpoint");
      setQuizPhase("answering");
    }
  }

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (playerPhase === "playing") {
      el.pause();
      setPlayerPhase("paused");
    } else {
      void el.play();
      setPlayerPhase("playing");
    }
  }

  function handleRelisten() {
    const el = audioRef.current;
    if (!el) return;
    checkpointFiredRef.current = false;
    el.currentTime = Math.max(0, audio.checkpointSeconds - 10);
    void el.play();
    setPlayerPhase("playing");
  }

  function handleSubmit() {
    const answerList = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId,
      optionId,
    }));
    setQuizPhase("submitting");
    submitMutation.mutate(
      {
        topicSlug: audio.topic.slug,
        audioSlug: audio.slug,
        answers: answerList,
      },
      {
        onSuccess: (data) => {
          setSubmission(data);
          setQuizPhase("results");
        },
        onError: () => {
          setQuizPhase("answering");
        },
      },
    );
  }

  function handleContinue() {
    const el = audioRef.current;
    if (!el) return;
    void el.play();
    setPlayerPhase("playing");
  }

  const allAnswered =
    audio.questions.length > 0 &&
    audio.questions.every((q) => q.id in answers);

  const progressPct =
    audio.durationSeconds && audio.durationSeconds > 0
      ? Math.min(100, (currentTime / audio.durationSeconds) * 100)
      : null;

  return (
    <>
      <audio
        ref={audioRef}
        src={audio.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlayerPhase("done")}
        preload="metadata"
      />

      <div className="mt-8 rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.76)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Player checkpoint
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              Pause at {audio.checkpointLabel}
            </p>
          </div>
          <span className="rounded-full bg-[var(--foreground)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--background)]">
            Modal with 4 questions
          </span>
        </div>

        {progressPct !== null && (
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--foreground)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
          <span>{formatTime(currentTime)}</span>
          {audio.durationSeconds !== null && audio.durationSeconds > 0 && (
            <span>{formatTime(audio.durationSeconds)}</span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={togglePlay}
            disabled={playerPhase === "checkpoint" || playerPhase === "done"}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            aria-label={playerPhase === "playing" ? "Pause" : "Play"}
          >
            {playerPhase === "playing" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
              </svg>
            )}
          </button>

          <p className="text-sm text-[var(--muted)]">
            {playerPhase === "idle" && "Press play to start"}
            {playerPhase === "playing" && "Listening…"}
            {playerPhase === "paused" && "Paused"}
            {playerPhase === "checkpoint" &&
              "Quiz time — answer the questions to continue"}
            {playerPhase === "done" && "Finished"}
          </p>
        </div>
      </div>

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
                  Answer all 4 questions, then keep listening.
                </p>

                <div className="mt-6 space-y-5">
                  {audio.questions.map((question) => (
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
                    Re-listen
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
                    ? "Perfect score! Keep listening."
                    : submission.correctCount >= Math.ceil(submission.total / 2)
                      ? "Good effort. Review the questions below."
                      : "Take another listen and try again."}
                </p>

                <div className="mt-6 space-y-4">
                  {audio.questions.map((question) => {
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
                  Continue listening
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
