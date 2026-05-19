import type { Metadata } from 'next';
import Script from 'next/script';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Da Trove | QOOBIX',
  description:
    'Subscribe to access free QOOBIX, Goalverse, and Punkia antidotes: checklists, decoders, field notes, and myth-crushing material.'
};

const troveItems = [
  {
    title: 'Goalverse',
    text: 'The Motivational Contamination Checklist — for detecting goal worship, discipline theatre, hustle fog, and self-improvement residue.'
  },
  {
    title: 'Punkia',
    text: 'The Corporate Fog Decoder — for translating workplace phrases before they reproduce in the meeting calendar.'
  },
  {
    title: 'QOOBIX / Proteus',
    text: 'Future myth-crushing notes, diagnostics, and strange little instruments for inspecting fashionable nonsense.'
  }
];

export default function TrovePage() {
  return (
    <div className="qoobix-shell">
      <div className="qoobix-grid pointer-events-none fixed inset-0 opacity-30" />

      <Header />

      <main className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-4xl text-center">
          <p
            className="inline-flex rounded-xl border px-4 py-2 text-xs font-medium uppercase tracking-[0.28em]"
            style={{
              borderColor: 'rgba(232, 90, 42, 0.35)',
              color: '#E85A2A',
              background: 'rgba(232, 90, 42, 0.08)'
            }}
          >
            Free decontamination material
          </p>

          <h1 className="mt-7 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Da Trove
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-xl leading-8 sm:text-2xl"
            style={{ color: 'var(--foreground)' }}
          >
            Free antidotes from QOOBIX, Goalverse, and Punkia.
          </p>

          <div
            className="mx-auto mt-6 max-w-3xl space-y-5 text-base leading-8 sm:text-lg"
            style={{ color: 'var(--muted)' }}
          >
            <p>
              Enter your email and receive access to the free decontamination
              folder: checklists, decoders, field notes, phrasebooks, and other
              small instruments for removing nonsense before it reproduces in
              your calendar.
            </p>

            <p>
              Proteus will send the access link. It has been instructed not to
              judge your inbox, though no one can guarantee compliance.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {troveItems.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border p-6"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--panel)',
                boxShadow: '0 20px 70px var(--shadow)'
              }}
            >
              <h2 className="text-xl font-semibold tracking-[-0.035em]">
                {item.title}
              </h2>

              <p
                className="mt-4 text-base leading-7"
                style={{ color: 'var(--muted)' }}
              >
                {item.text}
              </p>
            </article>
          ))}
        </section>

        <section
          className="mx-auto mt-12 max-w-3xl rounded-3xl border p-5 sm:p-7"
          style={{
            borderColor: 'rgba(232, 90, 42, 0.35)',
            background: 'var(--panel-strong)',
            boxShadow: '0 24px 80px var(--shadow)'
          }}
          aria-label="QOOBIX free material signup form"
        >
          <div className="overflow-hidden rounded-2xl">
            <iframe
              data-skip-lazy=""
              src="https://naralimon.ipzmarketing.com/f/X_bd0GLSKkQ"
              frameBorder="0"
              scrolling="no"
              width="100%"
              className="ipz-iframe min-h-[520px] w-full"
              title="QOOBIX free material signup form"
            />
          </div>

          <Script
            src="https://assets.ipzmarketing.com/assets/signup_form/iframe_v1.js"
            strategy="afterInteractive"
            data-cfasync="false"
          />

          <p
            className="mt-6 text-center text-sm leading-7"
            style={{ color: 'var(--muted)' }}
          >
            Your email is used to send the free materials and occasional QOOBIX,
            Goalverse, and Punkia updates. You can unsubscribe at any time. No
            motivational fog will be intentionally transmitted.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
