import type { Metadata } from 'next';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'Request an Intelligence Review',
  description: 'Request a QOOBIX IDAAS intelligence review.'
};

const serviceRequestHref =
  'mailto:hub@siendaweblines.com,bob@siendaweblines.com?subject=QOOBIX%20IDAAS%20intelligence%20review&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20a%20QOOBIX%20IDAAS%20intelligence%20review.%0A%0AAnalysed%20business%3A%0AProduct%20or%20service%3A%0ATarget%20country%20or%20region%3A%0AMarket%20question%3A%0ACommercial%20objective%3A%0A%0APlease%20contact%20me%20with%20the%20next%20steps.%0A%0AThank%20you.';

const fields = [
  'Analysed business',
  'Product or service analysed',
  'Target country or region',
  'Commercial objective',
  'Market question',
  'Target customer types',
  'Known competitors',
  'Discovery target, if required',
  'Preferred report language'
];

export default function ContactPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">Request an intelligence review</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
          Start with the business being analysed and the market question.
        </h1>
        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS is delivered through an operator-led process. To request a review, describe
          the analysed business, the product or service, the target geography and the commercial
          decision you need to support.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Panel strong>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">Request by email</h2>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            Use the prepared email to request the next step. Do not send confidential material,
            passwords, trade secrets or sensitive personal data in the first message.
          </p>
          <div className="mt-6">
            <a
              href={serviceRequestHref}
              style={{ color: '#ffffff' }}
              className="qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-4 py-2.5 text-sm font-semibold shadow-[0_12px_28px_rgba(0,153,255,0.18)] transition hover:bg-[var(--qoobix-orange-dark)]"
            >
              Request an intelligence review →
            </a>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">Useful details to include</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field} className="rounded-xl border border-[var(--qoobix-border)] bg-white/52 px-4 py-3 text-sm font-semibold">
                {field}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}
