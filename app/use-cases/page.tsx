import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'QOOBIX IDAAS Use Cases',
  description: 'Example market-intelligence use cases for QOOBIX IDAAS.'
};

const useCases = [
  'An Italian manufacturer assessing distributors in Germany.',
  'A Spanish restaurant group mapping local competitors and expansion areas.',
  'A UK service company evaluating possible partners in Spain.',
  'A construction-product company analysing channels in Portugal.',
  'A software company mapping competitors in Italy.',
  'A hospitality operator comparing zones on the Costa del Sol.'
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
          QOOBIX IDAAS is used when a business needs to understand a territory before committing
          money, time, people, campaigns, distributors, partners or expansion plans.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => (
          <Panel key={useCase}>
            <p className="leading-8 text-[var(--qoobix-muted)]">{useCase}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--qoobix-radius-large)] border border-[var(--qoobix-border)] bg-white/52 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.035em]">The common pattern</h2>
        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
          The analysed business does not need to match the operator workspace. What matters is the
          job definition: the business being analysed, the market question, the target geography, the
          objective and the required output.
        </p>
        <div className="mt-6">
          <ButtonLink href="/contact">Request an intelligence review</ButtonLink>
        </div>
      </div>
    </section>
  );
}
