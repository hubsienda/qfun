import Link from 'next/link';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

const capabilities = [
  'Market-entry intelligence',
  'Competitor mapping',
  'Distributor discovery',
  'Partner discovery',
  'Candidate organisation discovery for verification',
  'Channel analysis',
  'Regional prioritisation',
  'Commercial risk review',
  'Opportunity analysis',
  'Action-priority reporting'
];

const packages = [
  {
    title: 'Market Reality Check',
    text: 'For businesses that need to understand whether a market, region or commercial idea deserves further attention.'
  },
  {
    title: 'Competitor Mapping',
    text: 'For businesses that need to understand who competes with them by segment, geography, positioning and customer type.'
  },
  {
    title: 'Distributor Discovery',
    text: 'For manufacturers or suppliers looking for candidate distributors, resellers or channel partners for verification.'
  },
  {
    title: 'Market Entry Intelligence Pack',
    text: 'For businesses preparing to enter a country, region or sector and needing analysis, discovery, prioritisation and action steps.'
  }
];

const steps = [
  'Define the analysed business, sector, market question, target countries, channels and discovery scope.',
  'Run the intelligence process and, where required, discover candidate organisations for verification.',
  'Review and refine the output before preparing the intelligence package.',
  'Deliver editable DOCX reports, XLSX workbooks, RTF documents and CSV tables.'
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="qoobix-grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="qoobix-orb -right-24 top-14 md:right-14 md:top-24" />
      <div className="qoobix-orb -left-28 bottom-20 opacity-35" />

      <section className="qoobix-container relative py-12 md:py-18 lg:py-22">
        <div className="grid items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
          <div>
            <p className="qoobix-kicker">QOOBIX IDAAS</p>

            <h1
              className="qoobix-gradient-text mt-7 max-w-3xl font-semibold tracking-[-0.055em]"
              style={{
                fontSize: 'clamp(2.35rem, 3.8vw, 3.7rem)',
                lineHeight: 1.02
              }}
            >
              Market intelligence delivered as a service.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--qoobix-muted)] md:text-xl">
              Before you enter a market, appoint a distributor, open a new location, chase prospects
              or invest in a campaign, QOOBIX IDAAS helps you understand the territory: who operates
              there, who competes there, who may matter and what should be verified first.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact">Request an intelligence review</ButtonLink>

              <ButtonLink href="/what-qoobix-idaas-does" variant="secondary">
                See what QOOBIX IDAAS can analyse
              </ButtonLink>
            </div>
          </div>

          <div className="qoobix-card-strong rounded-[var(--qoobix-radius-large)] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qoobix-orange)]">
              Intelligence Delivered As A Service
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
              The client buys the intelligence outcome, not access to a raw tool.
            </h2>

            <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
              QOOBIX IDAAS is the market-intelligence delivery environment used by Sienda Ltd,
              Naralimon s.c. and authorised operator workspaces to prepare structured intelligence
              packages for clients.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {capabilities.slice(0, 6).map((capability) => (
                <div
                  key={capability}
                  className="rounded-xl border border-[var(--qoobix-border)] bg-white/52 px-4 py-3 text-sm font-semibold shadow-[0_8px_22px_rgba(51,51,51,0.03)]"
                >
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="qoobix-container relative pb-12 md:pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          <Panel>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">Managed intelligence</h2>
            <p className="mt-4 leading-7 text-[var(--qoobix-muted)]">
              The operator captures the business context, runs the intelligence process, reviews the
              result and delivers a practical package.
            </p>
          </Panel>

          <Panel>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">Candidates, not promises</h2>
            <p className="mt-4 leading-7 text-[var(--qoobix-muted)]">
              Discovery outputs are candidate organisations for verification. They are not verified
              leads, guaranteed distributors or approved partners.
            </p>
          </Panel>

          <Panel>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">Job-defined analysis</h2>
            <p className="mt-4 leading-7 text-[var(--qoobix-muted)]">
              QOOBIX IDAAS analyses the business defined in the job, not automatically the account
              owner or operator workspace.
            </p>
          </Panel>
        </div>
      </section>

      <section className="qoobix-container relative pb-12 md:pb-16">
        <div className="qoobix-card-strong rounded-[var(--qoobix-radius-large)] p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="qoobix-kicker">How it works</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
                From commercial question to intelligence package.
              </h2>
              <div className="mt-7">
                <Link href="/how-it-works" className="qoobix-link">
                  View the process →
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-xl border border-[var(--qoobix-border)] bg-white/52 p-4 shadow-[0_8px_22px_rgba(51,51,51,0.03)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--qoobix-orange)]">
                    Step {index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--qoobix-muted)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="qoobix-container relative pb-12 md:pb-16">
        <div className="mb-7 max-w-3xl">
          <p className="qoobix-kicker">Intelligence packages</p>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
            Built around the commercial decision, not the dashboard.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((item) => (
            <Panel key={item.title}>
              <h3 className="text-xl font-semibold tracking-[-0.025em]">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--qoobix-muted)]">{item.text}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="qoobix-container relative pb-24">
        <div className="qoobix-card-strong rounded-[var(--qoobix-radius-large)] p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="qoobix-kicker">Operator workspaces</p>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
                Sienda may analyse a restaurant. Naralimon may analyse a manufacturer.
              </h2>
            </div>

            <div>
              <p className="leading-8 text-[var(--qoobix-muted)]">
                An operator workspace belongs to Sienda Ltd, Naralimon s.c. or another authorised
                operator. The operator workspace controls administration and delivery. Each job then
                defines its own analysed business, market question, target geography and output
                language.
              </p>

              <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
                The account owner is not automatically the organisation being analysed. The job
                subject controls the analysis.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/operator-model">Understand the operator model</ButtonLink>
                <ButtonLink href="/outputs" variant="secondary">
                  See outputs
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
