import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'QOOBIX IDAAS Operator Model',
  description: 'How QOOBIX IDAAS supports Sienda, Naralimon and authorised operator workspaces.'
};

const operatorPoints = [
  'Sienda Ltd can operate QOOBIX IDAAS for any client, any sector, any target country and any supported language.',
  'Naralimon s.c. can operate QOOBIX IDAAS for Spanish-speaking clients and other permitted clients, with its own operator workspace.',
  'Future authorised operators may have their own workspaces, but each job must define its own analysed business profile.',
  'A provisioned private QOOBIX environment is a selected future or specialist option, not the primary public offer.'
];

export default function OperatorModelPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">Operator model</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
          Operator workspace and analysed business are not the same thing.
        </h1>
        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS supports operator workspaces. An operator workspace may belong to Sienda
          Ltd, Naralimon s.c. or another authorised operator. The workspace controls delivery. The
          job defines what is being analysed.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {operatorPoints.map((point) => (
          <Panel key={point}>
            <p className="leading-8 text-[var(--qoobix-muted)]">{point}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel strong>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">The essential rule</h2>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            QOOBIX IDAAS analyses the business defined in the job, not the account owner or
            operator. The account owner is not automatically the analysed organisation.
          </p>
        </Panel>

        <Panel>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">Simple examples</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--qoobix-muted)]">
            <li>Sienda may analyse a restaurant.</li>
            <li>Naralimon may analyse a manufacturer.</li>
            <li>An Italy operator may analyse a Spanish hospitality business.</li>
            <li>The job subject controls the analysis.</li>
          </ul>
        </Panel>
      </div>

      <div className="mt-10">
        <ButtonLink href="/contact">Request an intelligence review</ButtonLink>
      </div>
    </section>
  );
}
