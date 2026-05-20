'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type {
  ComposedDiagnosis,
  DiagnosticAnswer,
  DiagnosticPath,
  DiagnosticQuestion,
  TagScores,
  UserAnswer
} from '@/lib/diagnostics';
import {
  QUESTIONS_PER_RUN,
  buildUserAnswer,
  composeDiagnosis,
  createInitialScores,
  getSafeFreeUrl,
  getSafePaidUrl,
  scoreAnswer,
  selectQuestions
} from '@/lib/diagnosticEngine';

type DiagnosticStage = 'selector' | 'questions' | 'result';

type QoobixDiagnosticProps = {
  paths: DiagnosticPath[];
};

const chamberDescriptions: Record<string, string> = {
  goalverse:
    'Goal worship, discipline theatre, productivity guilt, hard-work myths, mindset leakage, and self-improvement fog.',
  punkia:
    'Corporate fog, AI theatre, fake innovation, meetings, dashboards, and management language with poor oxygen levels.',
  'ai-theatre':
    'AI hype, automation fog, fake intelligence, business theatre, and claims that smell expensive but collapse under inspection.'
};

const chamberButtonLabels: Record<string, string> = {
  goalverse: 'Enter Goalverse chamber',
  punkia: 'Enter Punkia chamber',
  'ai-theatre': 'Begin mixed diagnostic'
};

export default function QoobixDiagnostic({ paths }: QoobixDiagnosticProps) {
  const [stage, setStage] = useState<DiagnosticStage>('selector');
  const [selectedPath, setSelectedPath] = useState<DiagnosticPath | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<DiagnosticAnswer | null>(null);
  const [scores, setScores] = useState<TagScores>({});
  const [answersGiven, setAnswersGiven] = useState<UserAnswer[]>([]);

  const currentQuestion = selectedQuestions[currentQuestionIndex] ?? null;

  const composedDiagnosis: ComposedDiagnosis | null = useMemo(() => {
    if (!selectedPath || stage !== 'result') {
      return null;
    }

    return composeDiagnosis(selectedPath, scores, answersGiven);
  }, [answersGiven, scores, selectedPath, stage]);

  function scrollToDiagnostic() {
    window.setTimeout(() => {
      document
        .getElementById('qoobix-diagnostic-engine')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function startPath(path: DiagnosticPath) {
    const seed = Date.now() + path.id.length;
    const questions = selectQuestions(path, QUESTIONS_PER_RUN, seed);

    setSelectedPath(path);
    setSelectedQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScores(createInitialScores(path));
    setAnswersGiven([]);
    setStage('questions');
    scrollToDiagnostic();
  }

  function chooseAnswer(answer: DiagnosticAnswer) {
    if (!currentQuestion || selectedAnswer) {
      return;
    }

    const userAnswer = buildUserAnswer(currentQuestion, answer);

    setSelectedAnswer(answer);
    setScores((currentScores) => scoreAnswer(currentScores, answer));
    setAnswersGiven((currentAnswers) => [...currentAnswers, userAnswer]);
  }

  function continueJourney() {
    if (currentQuestionIndex + 1 >= selectedQuestions.length) {
      setStage('result');
      setSelectedAnswer(null);
      scrollToDiagnostic();
      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
    scrollToDiagnostic();
  }

  function restartCurrentChamber() {
    if (!selectedPath) {
      resetToSelector();
      return;
    }

    startPath(selectedPath);
  }

  function resetToSelector() {
    setStage('selector');
    setSelectedPath(null);
    setSelectedQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScores({});
    setAnswersGiven([]);
    scrollToDiagnostic();
  }

  function getFeedbackText(question: DiagnosticQuestion, answer: DiagnosticAnswer) {
    return answer.id === question.correctAnswerId
      ? question.defaultCorrectReaction
      : question.defaultWrongReaction;
  }

  return (
    <section
      id="qoobix-diagnostic-engine"
      className="relative mx-auto w-full max-w-7xl scroll-mt-10 px-5 py-16 sm:px-8 lg:px-10"
    >
      {stage === 'selector' ? (
        <div>
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: '#E85A2A' }}
            >
              Start the show
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              Proteus has detected a visitor. This is rarely a neutral event.
            </h2>

            <p
              className="mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg"
              style={{ color: 'var(--muted)' }}
            >
              Before the cube opens, we must identify the contamination.
            </p>

            <p className="mt-7 text-xl font-semibold tracking-[-0.03em]">
              What kind of nonsense has entered your ventilation system?
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {paths.map((path) => (
              <article
                key={path.id}
                className="rounded-3xl border p-6 transition hover:-translate-y-1 sm:p-7"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--panel)',
                  boxShadow: '0 20px 70px var(--shadow)'
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.24em]"
                  style={{ color: '#E85A2A' }}
                >
                  {path.intro.eyebrow}
                </p>

                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                  {path.title}
                </h3>

                <p
                  className="mt-4 min-h-36 text-base leading-7"
                  style={{ color: 'var(--muted)' }}
                >
                  {chamberDescriptions[path.id] ?? path.description}
                </p>

                <button
                  type="button"
                  onClick={() => startPath(path)}
                  className="qoobix-focus mt-6 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                  style={{
                    borderColor: 'rgba(232, 90, 42, 0.55)',
                    color: '#E85A2A',
                    background: 'transparent'
                  }}
                >
                  {chamberButtonLabels[path.id] ?? path.intro.startButton}
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {stage === 'questions' && selectedPath && currentQuestion ? (
        <div
          className="mx-auto max-w-5xl rounded-3xl border p-5 shadow-2xl sm:p-8 lg:p-10"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--panel-strong)',
            boxShadow: '0 30px 90px var(--shadow)'
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: '#E85A2A' }}
              >
                {selectedPath.shortTitle} chamber
              </p>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                {selectedPath.intro.title}
              </h2>
            </div>

            <p
              className="rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--muted)',
                background: 'var(--panel)'
              }}
            >
              Question {currentQuestionIndex + 1} of {selectedQuestions.length}
            </p>
          </div>

          <p className="mt-7 text-xl leading-8 sm:text-2xl">
            {currentQuestion.question}
          </p>

          <div className="mt-8 grid gap-3">
            {currentQuestion.answers.map((answer) => {
              const isSelected = selectedAnswer?.id === answer.id;
              const isCorrect = answer.id === currentQuestion.correctAnswerId;

              return (
                <button
                  key={answer.id}
                  type="button"
                  onClick={() => chooseAnswer(answer)}
                  disabled={Boolean(selectedAnswer)}
                  className="qoobix-focus rounded-xl border px-5 py-4 text-left text-base leading-7 transition enabled:hover:-translate-y-0.5 disabled:cursor-default"
                  style={{
                    borderColor: isSelected
                      ? isCorrect
                        ? 'rgba(232, 90, 42, 0.75)'
                        : 'var(--border)'
                      : 'var(--border)',
                    background: isSelected
                      ? 'rgba(232, 90, 42, 0.12)'
                      : 'rgba(255, 255, 255, 0.03)',
                    color: 'var(--foreground)'
                  }}
                  aria-pressed={isSelected}
                >
                  {answer.text}
                </button>
              );
            })}
          </div>

          {selectedAnswer ? (
            <div
              className="mt-8 rounded-2xl border p-5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.42)',
                background: 'rgba(232, 90, 42, 0.08)'
              }}
              aria-live="polite"
            >
              <p className="text-lg leading-8">
                {getFeedbackText(currentQuestion, selectedAnswer)}
              </p>

              <div
                className="mt-5 grid gap-4 rounded-2xl border p-5"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--panel)'
                }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.24em]"
                    style={{ color: '#E85A2A' }}
                  >
                    Reality check
                  </p>
                  <p className="mt-2 text-base leading-7">
                    {currentQuestion.realityCheck}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.24em]"
                    style={{ color: '#E85A2A' }}
                  >
                    Practical move
                  </p>
                  <p className="mt-2 text-base leading-7">
                    {currentQuestion.practicalMove}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={continueJourney}
                  className="qoobix-focus inline-flex justify-center rounded-xl bg-[#E85A2A] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  {currentQuestionIndex + 1 >= selectedQuestions.length
                    ? 'Show diagnosis'
                    : 'Continue diagnostic'}
                </button>

                <button
                  type="button"
                  onClick={resetToSelector}
                  className="qoobix-focus inline-flex justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    background: 'var(--panel)'
                  }}
                >
                  Try another chamber
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {stage === 'result' && selectedPath && composedDiagnosis ? (
        <div
          className="mx-auto max-w-5xl rounded-3xl border p-5 shadow-2xl sm:p-8 lg:p-10"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--panel-strong)',
            boxShadow: '0 30px 90px var(--shadow)'
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#E85A2A' }}
          >
            Diagnosis
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {composedDiagnosis.diagnosis.title}
          </h2>

          <p
            className="mt-5 rounded-2xl border p-5 text-base leading-8"
            style={{
              borderColor: 'rgba(232, 90, 42, 0.42)',
              background: 'rgba(232, 90, 42, 0.08)'
            }}
          >
            {composedDiagnosis.openingLine}
          </p>

          <div className="mt-7 grid gap-5">
            <ResultBlock
              label="Severity"
              text={composedDiagnosis.diagnosis.severityLabel}
            />
            <ResultBlock
              label="Proteus verdict"
              text={composedDiagnosis.diagnosis.proteusVerdict}
            />
            <ResultBlock
              label="What this means"
              text={composedDiagnosis.diagnosis.whatItMeans}
            />
            <ResultBlock
              label="The real mechanism"
              text={composedDiagnosis.diagnosis.realMechanism}
            />
            <ResultBlock
              label="Practical move"
              text={composedDiagnosis.diagnosis.practicalMove}
            />
          </div>

          <p className="mt-7 text-base leading-8" style={{ color: 'var(--muted)' }}>
            {composedDiagnosis.transitionLine}
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article
              className="rounded-2xl border p-5"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--panel)'
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.24em]"
                style={{ color: '#E85A2A' }}
              >
                Recommended free antidote
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                {selectedPath.products.free.label}: {selectedPath.products.free.title}
              </h3>

              <p className="mt-4 text-base leading-7" style={{ color: 'var(--muted)' }}>
                {composedDiagnosis.diagnosis.freeAntidoteCopy ||
                  selectedPath.products.free.copy}
              </p>
            </article>

            <article
              className="rounded-2xl border p-5"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--panel)'
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.24em]"
                style={{ color: '#E85A2A' }}
              >
                Recommended paid antidote
              </p>

              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                {selectedPath.products.paid.label}: {selectedPath.products.paid.title}
              </h3>

              <p className="mt-4 text-base leading-7" style={{ color: 'var(--muted)' }}>
                {composedDiagnosis.diagnosis.paidAntidoteCopy ||
                  selectedPath.products.paid.copy}
              </p>
            </article>
          </div>

          <p className="mt-7 text-base leading-8">
            {composedDiagnosis.softSalesLine}
          </p>

          <p className="mt-3 text-base leading-8" style={{ color: 'var(--muted)' }}>
            {composedDiagnosis.closingSting}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={getSafeFreeUrl(selectedPath)}
              className="qoobix-focus inline-flex justify-center rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.55)',
                color: '#E85A2A',
                background: 'transparent'
              }}
            >
              Enter Da Trove
            </Link>

            <a
              href={getSafePaidUrl(selectedPath)}
              target="_blank"
              rel="noreferrer noopener"
              className="qoobix-focus inline-flex justify-center rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.55)',
                color: '#E85A2A',
                background: 'transparent'
              }}
            >
              Buy on Sienda Media
            </a>

            <button
              type="button"
              onClick={restartCurrentChamber}
              className="qoobix-focus inline-flex justify-center rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                background: 'var(--panel)'
              }}
            >
              Run this chamber again
            </button>

            <button
              type="button"
              onClick={resetToSelector}
              className="qoobix-focus inline-flex justify-center rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                background: 'var(--panel)'
              }}
            >
              Try another chamber
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ResultBlock({ label, text }: { label: string; text: string }) {
  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--panel)'
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.24em]"
        style={{ color: '#E85A2A' }}
      >
        {label}
      </p>

      <p className="mt-3 text-base leading-8">{text}</p>
    </section>
  );
}
