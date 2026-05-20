'use client';

import Link from 'next/link';
import QoobixDiagnostic from '@/components/QoobixDiagnostic';
import type { DiagnosticPath } from '@/lib/diagnostics';

type HomePageProps = {
  diagnosticPaths: DiagnosticPath[];
};

export default function HomePage({ diagnosticPaths }: HomePageProps) {
  function approachCube() {
    document
      .getElementById('qoobix-diagnostic-engine')
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
            The cube is open
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Da QOOBIX
          </h1>

          <p
            className="mt-5 max-w-xl text-lg leading-8 sm:text-xl"
            style={{ color: 'var(--muted)' }}
          >
            Managed by Proteus, the algorithm that refuses to flatter you.
          </p>

          <p
            className="mt-5 max-w-xl text-base leading-8"
            style={{ color: 'var(--muted)' }}
          >
            A satirical intelligence cube for crushing myths, detecting
            nonsense, and recommending the occasional antidote.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={approachCube}
              className="qoobix-focus inline-flex items-center justify-center rounded-xl bg-[#E85A2A] px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Approach da QOOBIX
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
              Enter Da Trove
            </Link>
          </div>

          <p className="mt-5 max-w-md text-sm leading-6" style={{ color: 'var(--muted)' }}>
            Correct answers open doors. Comfortable answers attract commentary.
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

      <QoobixDiagnostic paths={diagnosticPaths} />

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
            Recommended antidotes are sold separately. Obviously.
          </h2>

          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-8 sm:text-lg"
            style={{ color: 'var(--muted)' }}
          >
            QOOBIX points towards satirical field manuals, anti-coaching
            checklists, corporate fog decoders, AI-theatre warnings, and
            practical instruments for detecting nonsense before it reproduces in
            your calendar.
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
              Enter Da Trove
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
              Visit Sienda Media
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
