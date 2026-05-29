import Link from 'next/link';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

const principles = [
  {
    title: 'Provisioned, not public',
    text: 'Each client receives a private configured environment. QOOBIX is not a public SaaS bazaar with a login queue and a dashboard pretending to be strategy.'
  },
  {
    title: 'Store the job, not the intelligence',
    text: 'Generated leads, competitors, partner lists, and market notes are delivered as downloadable files. The database keeps the job record, status, links, and necessary configuration.'
  },
  {
    title: 'Download the decision material',
    text: 'Reports are produced as editable DOCX and XLSX files, because intelligence trapped inside a platform usually becomes platform-shaped wallpaper.'
  }
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="qoobix-grid-bg pointer-events-none absolute inset-0 opacity-70" />

      <section className="qoobix-container relative py-20 md:py-28">
        <div className="max-w-4xl">
          <p className="mb-5 inline-flex rounded-full border border-[var(--qoobix-border)] bg-white/60 px-4 py-2 text-sm text-[var(--qoobix-muted)] backdrop-blur">
            Private market intelligence. No dashboard obesity.
          </p>

          <h1 className="qoobix-gradient-text text-5xl font-semibold tracking-tight md:text-7xl">
            Search a market. Detect opportunity. Download the intelligence.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-8 text-[var(--qoobix-muted)]">
            QOOBIX is private AI-powered market intelligence, provisioned for your business.
            It turns scattered market signals into structured commercial decisions, without
            becoming another bloated platform.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/access">Enter private access</ButtonLink>
            <ButtonLink href="/admin" variant="secondary">
              Admin area
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="qoobix-container relative pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <Panel key={principle.title}>
              <h2 className="text-xl font-semibold">{principle.title}</h2>
              <p className="mt-4 leading-7 text-[var(--qoobix-muted)]">{principle.text}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="qoobix-narrow relative pb-24">
        <div className="qoobix-card-strong rounded-[2rem] p-8 md:p-10">
          <h2 className="text-3xl font-semibold tracking-tight">Built for commercial questions.</h2>
          <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
            Where should we sell this product? Which countries, regions, or cities deserve
            attention first? Who are the possible distributors, partners, resellers, buyers,
            installers, representatives, or decision-makers? Who are the competitors? What should
            we do next?
          </p>
          <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
            QOOBIX answers those questions with structured outputs. Not a CRM. Not a lead prison.
            Not another cathedral of tabs.
          </p>

          <div className="mt-8">
            <Link
              href="/access"
              className="qoobix-focus-ring text-sm font-semibold text-[var(--qoobix-orange)]"
            >
              Proceed to private access →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
