'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

type AnswerKey = 'A' | 'B' | 'C' | 'D';

const answers: Array<{
  key: AnswerKey;
  text: string;
}> = [
  { key: 'A', text: 'A difficult one.' },
  { key: 'B', text: 'A long-term one.' },
  { key: 'C', text: 'One without a deadline.' },
  { key: 'D', text: 'One inherited from people you do not actually respect.' }
];

const territories = [
  {
    title: 'GOALVERSE',
    description:
      'The anti-coaching territory of QOOBIX. It mocks goal worship, productivity theatre, motivation clichés, success myths, hard-work fairy tales, hustle culture, and the nonsense sold as personal transformation.',
    button: 'Enter through QOOBIX',
    href: '/goalverse'
  },
  {
    title: 'Punkia',
    description:
      'A satirical territory for corporate fog, AI theatre, LinkedIn rituals, fake innovation, meritocracy myths, business language, and organised modern absurdity.',
    button: 'Enter through QOOBIX',
    href: '/punkia'
  },
  {
    title: 'Proteus',
    description:
      'The ever-changing intelligence inside Da QOOBIX. Proteus asks unpleasant questions, detects fashionable nonsense, and occasionally produces something useful before returning to mockery.',
    button: 'Meet Proteus',
    href: '/proteus'
  }
];

export default function HomePage() {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerKey | null>(null);

  const isCorrect = selectedAnswer === 'D';

  function approachCube() {
    document
      .getElementById('proteus-encounter')
      ?.scrollIntoView({ behaviour: 'smooth', block: 'start' } as ScrollIntoViewOptions);
  }

  return (
    <div className="qoobix-shell">
      <div className="qoobix-grid pointer-events-none fixed inset-0 opacity-30" />

      <Header />

      <main>
        <section className="relative mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-6 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
          <div className="order-2 max-w-2xl lg:order-1">
            <p
              className="mb-5 inline-flex rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.28em]"
              style={{
                borderColor: 'rgba(232, 90, 42, 0.35)',
                color: '#E85A2A',
                background: 'rgba(232, 90, 42, 0.08)'
              }}
            >
              Managed by Proteus
            </p>

            <h1 className="text-5xl font-semibold tracking-[-0.07em] sm:text-6xl lg:text-7xl">
              Da QOOBIX
            </h1>

            <p
              className="mt-5 max-w-xl text-xl leading-8 sm:text-2xl"
              style={{ color: 'var(--muted)' }}
            >
              Managed by Proteus, the algorithm that refuses to flatter you.
            </p>

            <p
              className="mt-5 max-w-xl text-base leading-8 sm:text-lg"
              style={{ color: 'var(--muted)' }}
            >
              A satirical intelligence cube for crushing myths, detecting
              nonsense, and recommending the occasional antidote.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={approachCube}
                className="qoobix-focus inline-flex items-center justify-center rounded-full bg-[#E85A2A] px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Approach da QOOBIX
              </button>

              <p className="max-w-xs text-sm leading-6" style={{ color: 'var(--muted)' }}>
                Correct answers open doors. Comfortable answers attract
                commentary.
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
            className="rounded-[2rem] border p-5 shadow-2xl sm:p-8 lg:p-10"
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
              First Proteus encounter
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Proteus asks:
            </h2>

            <p className="mt-4 text-xl leading-8 sm:text-2xl">
              What is the most dangerous kind of goal?
            </p>

            <div className="mt-8 grid gap-3">
              {answers.map((answer) => {
                const isSelected = selectedAnswer === answer.key;

                return (
                  <button
                    key={answer.key}
                    type="button"
                    onClick={() => setSelectedAnswer(answer.key)}
                    className="qoobix-focus rounded-2xl border px-5 py-4 text-left text-base leading-7 transition hover:-translate-y-0.5"
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
                className="mt-8 rounded-3xl border p-5"
                style={{
                  borderColor: isCorrect
                    ? 'rgba(232, 90, 42, 0.48)'
                    : 'var(--border)',
                  background: isCorrect
                    ? 'rgba(232, 90, 42, 0.1)'
                    : 'rgba(0, 0, 0, 0.04)'
                }}
              >
                <p className="text-lg leading-8">
                  {isCorrect
                    ? 'Correct. Disturbing, isn’t it? The productivity industry will now pretend not to have heard that.'
                    : 'Comfortable answer detected. Proteus has placed it in the drawer marked “motivational fog”.'}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/goalverse"
                    className="qoobix-focus inline-flex justify-center rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--panel)'
                    }}
                  >
                    Enter the GOALVERSE path
                  </Link>

                  <Link
                    href="/punkia"
                    className="qoobix-focus inline-flex justify-center rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--panel)'
                    }}
                  >
                    Enter the Punkia path
                  </Link>

                  <Link
                    href="/proteus"
                    className="qoobix-focus inline-flex justify-center rounded-full bg-[#E85A2A] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    Meet Proteus
                  </Link>
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
              Territories
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Three doors. None entirely safe.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {territories.map((territory) => (
              <article
                key={territory.title}
                className="rounded-[2rem] border p-6 transition hover:-translate-y-1 sm:p-7"
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
                  className="qoobix-focus mt-6 inline-flex rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                  style={{
                    borderColor: 'rgba(232, 90, 42, 0.45)',
                    color: '#E85A2A',
                    background: 'rgba(232, 90, 42, 0.08)'
                  }}
                >
                  {territory.button}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
          <div
            className="rounded-[2rem] border p-7 text-center sm:p-10"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--panel-strong)',
              boxShadow: '0 24px 80px var(--shadow)'
            }}
          >
            <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              Recommended antidotes are sold separately. Obviously.
            </h2>

            <p
              className="mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg"
              style={{ color: 'var(--muted)' }}
            >
              QOOBIX points towards field manuals, comic guides,
              myth-crushing workbooks, satirical diagnostics, and other products
              sold through Sienda Media.
            </p>

            <a
              href="https://siendamedia.com"
              target="_blank"
              rel="noreferrer noopener"
              className="qoobix-focus mt-8 inline-flex rounded-full bg-[#E85A2A] px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
            >
              Visit Sienda Media
            </a>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#E85A2A' }}
          >
            About Proteus
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Proteus is the intelligence inside Da QOOBIX.
          </h2>

          <div
            className="mt-6 space-y-5 text-lg leading-8"
            style={{ color: 'var(--muted)' }}
          >
            <p>
              It changes shape, asks inconvenient questions, detects nonsense,
              crushes fashionable myths, and recommends the occasional antidote.
            </p>

            <p>It is not here to motivate you.</p>

            <p>
              It is here to make the comfortable answer feel embarrassed.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { useState } from 'react';
