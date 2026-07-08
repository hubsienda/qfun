import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'Operator Model',
  description: 'How QOOBIX IDAAS distinguishes operator workspaces from the analysed business.'
};

const jobFields = [
  'Operator workspace',
  'Analysed business',
  'Analysed sector',
  'Product or service analysed',
  'Target country or countries',
  'Target geography, if applicable',
  'Report language',
  'Commercial objective',
  'Market question',
  'Target customer types',
  'Target channels',
  'Known competitors, if any',
  'Known partners, if any',
  'Discovery target',
  'Include categories',
  'Exclude categories',
  'Output format'
];

export default function OperatorModelPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">Operator model</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
          The operator workspace and the analysed business are not the same thing.
        </h1>
        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS is created and managed by Sienda Ltd and may be delivered directly or
          through qualified partner workspaces where appropriate.
        </p>
        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
          An operator workspace controls delivery, branding, users, report management, retention and
          administration. The job defines what is being analysed.
        </p>
        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
          This means QOOBIX IDAAS can deliver market intelligence for different companies, sectors,
          countries and supported languages without confusing the operator with the business being
          analysed.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel strong>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">The essential rule</h2>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            QOOBIX IDAAS analyses the business defined in the job, not the account owner, operator
            or partner workspace.
          </p>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            The account owner is not automatically the analysed organisation. Each job must define
            its own analysed business, sector, product or service, target geography, objective,
            language, discovery scope and output requirements.
          </p>
        </Panel>

        <Panel>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">Simple principle</h2>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            The operator delivers the intelligence.
          </p>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            The job defines the business being analysed.
          </p>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            The output is built around the client’s market question, not around the operator’s own
            sector.
          </p>
        </Panel>
      </div>

      <div className="mt-10 rounded-[var(--qoobix-radius-large)] border border-[var(--qoobix-border)] bg-white/52 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.035em]">What each job must define</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobFields.map((field) => (
            <div
              key={field}
              className="rounded-xl border border-[var(--qoobix-border)] bg-white/52 px-4 py-3 text-sm font-semibold"
            >
              {field}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-[var(--qoobix-radius-large)] border border-[var(--qoobix-border)] bg-white/52 p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-[-0.035em]">Private environments</h2>
        <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
          A provisioned private QOOBIX environment may be considered only for selected organisations
          or qualified partners, subject to configuration, training and controls. It is not the
          default public offer.
        </p>
      </div>

      <div className="mt-10">
        <ButtonLink href="/contact">Request an intelligence review</ButtonLink>
      </div>
    </section>
  );
}
