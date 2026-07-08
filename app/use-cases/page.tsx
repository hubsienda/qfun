import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'Use Cases',
  description: 'Commercial use cases for QOOBIX IDAAS market-intelligence packages.'
};

const useCases = [
  {
    title: 'Distributor and channel discovery',
    text: 'For companies that need to identify candidate distributors, resellers, agents, installers, representatives or channel partners in a target market.',
    outputs: [
      'candidate organisations for verification',
      'channel categories',
      'regional priorities',
      'relevance notes',
      'verification routes',
      'suggested next actions'
    ]
  },
  {
    title: 'Competitor and alternative mapping',
    text: 'For businesses that need to understand who competes with them, who substitutes them, how the market is segmented and where pressure or opportunity may exist.',
    outputs: [
      'competitor categories',
      'named candidates where discovery is included',
      'positioning notes',
      'substitute landscape',
      'saturation signals',
      'strategic caveats'
    ]
  },
  {
    title: 'Market-entry prioritisation',
    text: 'For businesses considering a new country, region, sector or customer segment before investing in commercial activity.',
    outputs: [
      'decision brief',
      'demand signals',
      'entry barriers',
      'channel options',
      'risk notes',
      'region or segment priorities',
      'next-step matrix'
    ]
  },
  {
    title: 'Partner and opportunity discovery',
    text: 'For businesses looking for possible commercial partners, technical partners, referral sources, local allies, buyer categories or organisations worth verifying before outreach.',
    outputs: [
      'candidate partner categories',
      'named organisations for verification where available',
      'relevance explanations',
      'suggested approach',
      'verification workflow'
    ]
  },
  {
    title: 'Location and local-market intelligence',
    text: 'For businesses that depend on geography, local demand, customer mix, competition density, visibility, footfall or neighbourhood positioning.',
    outputs: [
      'local competitor mapping',
      'area comparison',
      'customer segment notes',
      'channel opportunities',
      'visibility risks',
      'practical validation steps'
    ]
  },
  {
    title: 'Campaign and expansion readiness',
    text: 'For businesses preparing a sales campaign, launch, investment decision, export push or expansion plan and needing structured intelligence before spending.',
    outputs: [
      'what to verify first',
      'where to focus',
      'who may matter',
      'what not to assume',
      'which actions should come before budget is committed'
    ]
  }
];

export default function UseCasesPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">Use cases</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
          Market questions before expensive moves.
        </h1>
        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS is used when a business needs to understand a market before committing
          money, people, campaigns, distributors, partners, locations or expansion plans.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => (
          <Panel key={useCase.title}>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">{useCase.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--qoobix-muted)]">{useCase.text}</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--qoobix-orange)]">
              Typical output
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--qoobix-muted)]">
              {useCase.outputs.map((output) => (
                <li key={output}>• {output}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--qoobix-radius-large)] border border-[var(--qoobix-border)] bg-white/52 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.035em]">The common pattern</h2>
        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS does not start from a generic report template.
        </p>
        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
          It starts from a specific commercial question, defines the analysed business, sets the
          target geography, selects the objective, controls the discovery scope and delivers editable
          intelligence outputs for review and action.
        </p>
        <div className="mt-6">
          <ButtonLink href="/contact">Request an intelligence review</ButtonLink>
        </div>
      </div>
    </section>
  );
}
