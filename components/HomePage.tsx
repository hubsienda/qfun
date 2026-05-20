'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { HomeContent } from '@/lib/content-types';

type AnswerKey = 'A' | 'B' | 'C' | 'D';
type Chamber = 'goalverse' | 'punkia' | 'proteus';

type HomePageProps = {
  content: HomeContent;
};

export default function HomePage({ content }: HomePageProps) {
  const [selectedChamber, setSelectedChamber] = useState<Chamber | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null);

  const answers: Array<{
    key: AnswerKey;
    text: string;
  }> = [
    { key: 'A', text: content.answerA },
    { key: 'B', text: content.answerB },
    { key: 'C', text: content.answerC },
    { key: 'D', text: content.answerD }
  ];

  const isCorrect = selectedAnswer === content.correctAnswer;

  const goalverseDiagnosis = isCorrect
    ? {
        response: content.correctResponse,
        diagnosis: content.correctDiagnosis,
        myth: content.correctDetectedMyth,
        reality: content.correctRealityCheck,
        antidote: content.correctRecommendedAntidote
      }
    : {
        response: content.wrongResponse,
        diagnosis: content.wrongDiagnosis,
        myth: content.wrongDetectedMyth,
        reality: content.wrongRealityCheck,
        antidote: content.wrongRecommendedAntidote
      };

  const punkiaDiagnosis = {
    response: content.punkiaResponse,
    diagnosis: content.punkiaDiagnosis,
    myth: content.punkiaDetectedMyth,
    reality: content.punkiaRealityCheck,
    antidote: content.punkiaRecommendedAntidote
  };

  const proteusDiagnosis = {
    response: content.proteusResponse,
    diagnosis: content.proteusDiagnosis,
    myth: content.proteusDetectedMyth,
    reality: content.proteusRealityCheck,
    antidote: content.proteusRecommendedAntidote
  };

  function approachCube() {
    document
      .getElementById('chambers')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function chooseChamber(chamber: Chamber) {
    setSelectedChamber(chamber);
    setSelectedAnswer(null);

    window.setTimeout(() => {
      document
        .getElementById('active-diagnostic')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function DiagnosisCard({
    diagnosis
  }: {
    diagnosis: {
      response: string;
      diagnosis: string;
      myth: string;
      reality: string;
      antidote: string;
    };
  }) {
    return (
      <div
        className="mt-8 rounded-2xl border p-5"
        style={{
          borderColor: 'rgba(232, 90, 42, 0.42)',
          background: 'rgba(232, 90, 42, 0.08)'
        }}
      >
        <p className="text-lg leading-8">{diagnosis.response}</p>

        <div
          className="mt-6 grid gap-4 rounded-2xl border p-5"
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
              {content.diagnosisLabel}
            </p>
            <p className="mt-2 text-base leading-7">{diagnosis.diagnosis}</p>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: '#E85A2A' }}
            >
              {content.detectedMythLabel}
            </p>
            <p className="mt-2 text-base leading-7">{diagnosis.myth}</p>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: '#E85A2A' }}
            >
              {content.realityCheckLabel}
            </p>
            <p className="mt-2 text-base leading-7">{diagnosis.reality}</p>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: '#E85A2A' }}
            >
              {content.recommendedAntidoteLabel}
            </p>
            <p className="mt-2 text-base leading-7">{diagnosis.antidote}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/goalverse"
            className="qoobix-focus inline-flex justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(232, 90, 42, 0.55)',
              color: '#E85A2A',
              background: 'transparent'
            }}
          >
            {content.goalversePathButton}
          </Link>

          <Link
            href="/punkia"
            className="qoobix-focus inline-flex justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(232, 90, 42, 0.55)',
              color: '#E85A2A',
              background: 'transparent'
            }}
          >
            {content.punkiaPathButton}
          </Link>

          <Link
            href="/proteus"
            className="qoobix-focus inline-flex justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(232, 90, 42, 0.55)',
              color: '#E85A2A',
              background: 'transparent'
            }}
          >
            {content.proteusPathButton}
          </Link>

          <a
            href="#antidotes"
            className="qoobix-focus inline-flex justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              background: 'var(--panel)'
            }}
          >
            {content.futureAntidotesButton}
          </a>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section className="relative mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
        <div className="order-2 max-w-2xl lg:order-1">
          <p
            className="mb-5 inline-flex rounded-xl border px-4 py-2 text-xs font-medium uppercase tracking-[0.28em]"
            style={{
              borderColor: 'rgba(232, 90, 42, 0.35)',
              color: '#E85A2A',
              background: 'rgba(232, 90, 42, 0.08)'
            }}
          >
            {content.heroEyebrow}
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            {content.heroTitle}
          </h1>

          <p
            className="mt-5 max-w-xl text-lg leading-8 sm:text-xl"
            style={{ color: 'var(--muted)' }}
          >
            {content.heroLine}
          </p>

          <p
            className="mt-5 max-w-xl text-base leading-8"
            style={{ color: 'var(--muted)' }}
          >
            {content.heroDescription}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={approachCube}
              className="qoobix-focus inline-flex items-center justify-center rounded-xl bg-[#E85A2A] px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {content.heroButton}
            </button>

            <Link
              href="/trove"
              className="qoobix-focus inline-flex items-center justify-center rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.55)',
                color: '#E85A2A',
                background: 'transparent'
              }}
            >
              {content.troveButton}
            </Link>
          </div>

          <p className="mt-5 max-w-md text-sm leading-6" style={{ color: 'var(--muted)' }}>
            {content.heroSupport}
          </p>
        </div>

        <div className="order-1 flex justify-center lg:order-2">
          <div className="cube-stage py-10" aria-hidden="true">
            <div className="da-cube">
              <div className="cube-face cube-front" />
              <div className="cube-face cube-back" />
              <div className="cube-face cube-right" />
              <div className="cube-face cube-left" />
              <div className="cube-face cube-top" />
              <div className="cube-face cube-bottom" />
              <div className="cube-rune" />
              <div className="cube-core" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="chambers"
        className="relative mx-auto w-full max-w-7xl scroll-mt-10 px-5 py-16 sm:px-8 lg:px-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#E85A2A' }}
          >
            {content.showEyebrow}
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {content.showTitle}
          </h2>

          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: 'var(--muted)' }}
          >
            {content.showDescription}
          </p>

          <p className="mt-7 text-xl font-semibold tracking-[-0.03em]">
            {content.chamberQuestion}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <article
            className="rounded-3xl border p-6 transition hover:-translate-y-1 sm:p-7"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--panel)',
              boxShadow: '0 20px 70px var(--shadow)'
            }}
          >
            <h3 className="text-2xl font-semibold tracking-[-0.04em]">
              {content.goalverseChamberTitle}
            </h3>

            <p
              className="mt-4 min-h-36 text-base leading-7"
              style={{ color: 'var(--muted)' }}
            >
              {content.goalverseChamberDescription}
            </p>

            <button
              type="button"
              onClick={() => chooseChamber('goalverse')}
              className="qoobix-focus mt-6 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.55)',
                color: '#E85A2A',
                background: 'transparent'
              }}
            >
              {content.goalverseChamberButton}
            </button>
          </article>

          <article
            className="rounded-3xl border p-6 transition hover:-translate-y-1 sm:p-7"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--panel)',
              boxShadow: '0 20px 70px var(--shadow)'
            }}
          >
            <h3 className="text-2xl font-semibold tracking-[-0.04em]">
              {content.punkiaChamberTitle}
            </h3>

            <p
              className="mt-4 min-h-36 text-base leading-7"
              style={{ color: 'var(--muted)' }}
            >
              {content.punkiaChamberDescription}
            </p>

            <button
              type="button"
              onClick={() => chooseChamber('punkia')}
              className="qoobix-focus mt-6 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.55)',
                color: '#E85A2A',
                background: 'transparent'
              }}
            >
              {content.punkiaChamberButton}
            </button>
          </article>

          <article
            className="rounded-3xl border p-6 transition hover:-translate-y-1 sm:p-7"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--panel)',
              boxShadow: '0 20px 70px var(--shadow)'
            }}
          >
            <h3 className="text-2xl font-semibold tracking-[-0.04em]">
              {content.proteusChamberTitle}
            </h3>

            <p
              className="mt-4 min-h-36 text-base leading-7"
              style={{ color: 'var(--muted)' }}
            >
              {content.proteusChamberDescription}
            </p>

            <button
              type="button"
              onClick={() => chooseChamber('proteus')}
              className="qoobix-focus mt-6 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.55)',
                color: '#E85A2A',
                background: 'transparent'
              }}
            >
              {content.proteusChamberButton}
            </button>
          </article>
        </div>
      </section>

      {selectedChamber ? (
        <section
          id="active-diagnostic"
          className="relative mx-auto w-full max-w-5xl scroll-mt-10 px-5 py-16 sm:px-8 lg:px-10"
        >
          <div
            className="rounded-3xl border p-5 shadow-2xl sm:p-8 lg:p-10"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--panel-strong)',
              boxShadow: '0 30px 90px var(--shadow)'
            }}
          >
            {selectedChamber === 'goalverse' ? (
              <>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: '#E85A2A' }}
                >
                  {content.encounterEyebrow}
                </p>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                  {content.encounterTitle}
                </h2>

                <p className="mt-4 text-lg leading-8 sm:text-xl">
                  {content.question}
                </p>

                <div className="mt-8 grid gap-3">
                  {answers.map((answer) => {
                    const isSelected = selectedAnswer === answer.key;

                    return (
                      <button
                        key={answer.key}
                        type="button"
                        onClick={() => setSelectedAnswer(answer.key)}
                        className="qoobix-focus rounded-xl border px-5 py-4 text-left text-base leading-7 transition hover:-translate-y-0.5"
                        style={{
                          borderColor: isSelected ? '#E85A2A' : 'var(--border)',
                          background: isSelected
                            ? 'rgba(232, 90, 42, 0.12)'
                            : 'rgba(255, 255, 255, 0.03)',
                          color: 'var(--foreground)'
                        }}
                      >
                        <span className="font-semibold">{answer.key}.</span>{' '}
                        {answer.text}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer ? <DiagnosisCard diagnosis={goalverseDiagnosis} /> : null}
              </>
            ) : null}

            {selectedChamber === 'punkia' ? (
              <>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: '#E85A2A' }}
                >
                  Punkia chamber
                </p>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                  Corporate fog sample detected.
                </h2>

                <DiagnosisCard diagnosis={punkiaDiagnosis} />
              </>
            ) : null}

            {selectedChamber === 'proteus' ? (
              <>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: '#E85A2A' }}
                >
                  Proteus mixed diagnostic
                </p>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                  Unclassified nonsense approaching the cube.
                </h2>

                <DiagnosisCard diagnosis={proteusDiagnosis} />
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      <section
        id="antidotes"
        className="relative mx-auto w-full max-w-5xl scroll-mt-10 px-5 py-16 sm:px-8 lg:px-10"
      >
        <div
          className="rounded-3xl border p-7 text-center sm:p-10"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--panel-strong)',
            boxShadow: '0 24px 80px var(--shadow)'
          }}
        >
          <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            {content.bridgeTitle}
          </h2>

          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: 'var(--muted)' }}
          >
            {content.bridgeDescription}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/trove"
              className="qoobix-focus inline-flex justify-center rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.55)',
                color: '#E85A2A',
                background: 'transparent'
              }}
            >
              {content.bridgeTroveButton}
            </Link>

            <a
              href="https://siendamedia.com"
              target="_blank"
              rel="noreferrer noopener"
              className="qoobix-focus inline-flex justify-center rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.55)',
                color: '#E85A2A',
                background: 'transparent'
              }}
            >
              {content.bridgeStoreButton}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
