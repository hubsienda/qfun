'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import type { HomeContent } from '@/lib/content-types';

type AnswerKey = 'A' | 'B' | 'C' | 'D';

type TerritoryCard = {
  title: string;
  description: string;
  button: string;
  href: string;
};

type HomePageProps = {
  content: HomeContent;
  territories: TerritoryCard[];
};

export default function HomePage({ content, territories }: HomePageProps) {
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

  const diagnosis = isCorrect
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

  function approachCube() {
    document
      .getElementById('proteus-encounter')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

          <p
            className="mt-5 max-w-xl rounded-2xl border p-4 text-base leading-8"
            style={{
              color: 'var(--foreground)',
              borderColor: 'rgba(232, 90, 42, 0.32)',
              background: 'rgba(232, 90, 42, 0.07)'
            }}
          >
            {content.heroPurpose}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={approachCube}
              className="qoobix-focus inline-flex items-center justify-center rounded-xl bg-[#E85A2A] px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {content.heroButton}
            </button>

            <p className="max-w-xs text-sm leading-6" style={{ color: 'var(--muted)' }}>
              {content.heroSupport}
            </p>
          </div>
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
        id="proteus-encounter"
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

          {selectedAnswer ? (
            <div
              className="mt-8 rounded-2xl border p-5"
              style={{
                borderColor: isCorrect
                  ? 'rgba(232, 90, 42, 0.48)'
                  : 'var(--border)',
                background: isCorrect
                  ? 'rgba(232, 90, 42, 0.1)'
                  : 'rgba(0, 0, 0, 0.04)'
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
          ) : null}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#E85A2A' }}
          >
            {content.territoriesEyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {content.territoriesTitle}
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {territories.map((territory) => (
            <article
              key={territory.title}
              className="rounded-3xl border p-6 transition hover:-translate-y-1 sm:p-7"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--panel)',
                boxShadow: '0 20px 70px var(--shadow)'
              }}
            >
              <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                {territory.title}
              </h3>

              <p
                className="mt-4 min-h-40 text-base leading-7"
                style={{ color: 'var(--muted)' }}
              >
                {territory.description}
              </p>

              <Link
                href={territory.href}
                className="qoobix-focus mt-6 inline-flex rounded-xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                style={{
                  borderColor: 'rgba(232, 90, 42, 0.55)',
                  color: '#E85A2A',
                  background: 'transparent'
                }}
              >
                {territory.button}
              </Link>
            </article>
          ))}
        </div>
      </section>

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

          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-8"
            style={{ color: 'var(--foreground)' }}
          >
            {content.bridgeExtraLine}
          </p>

          <a
            href="https://siendamedia.com"
            target="_blank"
            rel="noreferrer noopener"
            className="qoobix-focus mt-8 inline-flex rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(232, 90, 42, 0.55)',
              color: '#E85A2A',
              background: 'transparent'
            }}
          >
            {content.bridgeButton}
          </a>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: '#E85A2A' }}
        >
          {content.aboutEyebrow}
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
          {content.aboutTitle}
        </h2>

        <div
          className="mt-6 space-y-5 text-lg leading-8"
          style={{ color: 'var(--muted)' }}
        >
          <p>{content.aboutParagraphOne}</p>
          <p>{content.aboutParagraphTwo}</p>
          <p>{content.aboutParagraphThree}</p>
        </div>

        <Link
          href="/proteus"
          className="qoobix-focus mt-8 inline-flex rounded-xl border px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5"
          style={{
            borderColor: 'rgba(232, 90, 42, 0.55)',
            color: '#E85A2A',
            background: 'transparent'
          }}
        >
          {content.aboutButton}
        </Link>
      </section>

      <section className="relative mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
        <div
          className="rounded-3xl border p-7 text-center sm:p-10"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--panel)',
            boxShadow: '0 24px 80px var(--shadow)'
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#E85A2A' }}
          >
            {content.logoBridgeEyebrow}
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
            {content.logoBridgeTitle}
          </h2>

          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8"
            style={{ color: 'var(--muted)' }}
          >
            {content.logoBridgeDescription}
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            <a
              href="https://goalverse.app"
              target="_blank"
              rel="noreferrer noopener"
              className="qoobix-focus flex min-h-36 items-center justify-center rounded-2xl border p-7 transition hover:-translate-y-0.5"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--panel-strong)'
              }}
              aria-label="Open Goalverse in a new tab"
            >
              <Image
                src="/goalverse-logo.png"
                alt="Goalverse"
                width={260}
                height={120}
                className="h-auto max-h-24 w-auto max-w-full object-contain"
              />
            </a>

            <a
              href="https://punkia.com"
              target="_blank"
              rel="noreferrer noopener"
              className="qoobix-focus flex min-h-36 items-center justify-center rounded-2xl border p-7 transition hover:-translate-y-0.5"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--panel-strong)'
              }}
              aria-label="Open Punkia in a new tab"
            >
              <Image
                src="/punkia-logo.png"
                alt="Punkia"
                width={260}
                height={120}
                className="h-auto max-h-24 w-auto max-w-full object-contain"
              />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
