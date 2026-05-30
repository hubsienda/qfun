import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

const serviceRequestHref =
  'mailto:hub@siendaweblines.com,bob@siendaweblines.com?subject=QOOBIX%20service%20request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20the%20QOOBIX%20private%20market%20intelligence%20service.%0A%0APlease%20contact%20me%20with%20the%20next%20steps.%0A%0AThank%20you.';

const principles = [
  {
    title: 'Provisioned, not public',
    text: 'Each client receives a private configured environment. QOOBIX is not a public SaaS bazaar with a login queue and a dashboard pretending to be strategy.'
  },
  {
    title: 'Reports, not platform captivity',
    text: 'The useful material is delivered as editable DOCX and XLSX files. Intelligence should move, not sit inside a dashboard wearing handcuffs.'
  },
  {
    title: 'Commercially sceptical',
    text: 'Proteus does not worship vague opportunity. It separates practical next moves from market fog, polite hallucination, and spreadsheet cosplay.'
  }
];

const outputs = [
  'Market-entry intelligence',
  'Distributor and partner direction',
  'Competitor and alternative mapping',
  'Regional opportunity priorities',
  'Commercial risk and caveat notes',
  'Editable DOCX and XLSX outputs'
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="qoobix-grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="qoobix-orb -right-20 top-16 md:right-20 md:top-24" />
      <div className="qoobix-orb -left-28 bottom-20 opacity-45" />

      <section className="qoobix-container relative py-12 md:py-18 lg:py-22">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="qoobix-kicker">Private market intelligence. No dashboard obesity.</p>

            <h1 className="qoobix-gradient-text mt-7 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.06]">
              Search a market. Detect opportunity. Download the intelligence.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--qoobix-muted)] md:text-xl">
              QOOBIX is provisioned market intelligence for businesses that need commercial
              direction, not another portal where strategy goes to develop mould.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/access">Client access</ButtonLink>

              <a
                href={serviceRequestHref}
                className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/68 px-5 py-3 text-sm font-semibold transition hover:bg-white"
              >
                Request the service
              </a>
            </div>
          </div>

          <div className="qoobix-card-strong rounded-[1.35rem] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--qoobix-orange)]">
              Managed by Proteus
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
              A private intelligence machine for commercial questions.
            </h2>

            <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
              QOOBIX turns a concrete market question into structured decision material: where to
              look, what to test, who may matter, what to verify, and what to do next.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {outputs.map((output) => (
                <div
                  key={output}
                  className="rounded-md border border-[var(--qoobix-border)] bg-white/62 px-4 py-3 text-sm font-semibold"
                >
                  {output}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="qoobix-container relative pb-12 md:pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <Panel key={principle.title}>
              <h2 className="text-xl font-semibold">{principle.title}</h2>
              <p className="mt-4 leading-7 text-[var(--qoobix-muted)]">{principle.text}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="qoobix-container relative pb-24">
        <div className="qoobix-card-strong rounded-[1.35rem] p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="qoobix-kicker">Built for commercial questions</p>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
                Ask the question that actually costs money.
              </h2>
            </div>

            <div>
              <p className="leading-8 text-[var(--qoobix-muted)]">
                Where should we sell this product? Which regions deserve attention first? Who are
                the possible distributors, partners, resellers, buyers, installers, representatives,
                or decision-makers? Who competes with us? What should we do next?
              </p>

              <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
                QOOBIX answers with structured outputs. Not a CRM. Not a lead prison. Not another
                cathedral of tabs.
              </p>

              <div className="mt-8">
                <a
                  href={serviceRequestHref}
                  className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-5 py-3 text-sm font-semibold text-[#ffffff] transition hover:bg-[var(--qoobix-orange-dark)]"
                >
                  Request the service →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
