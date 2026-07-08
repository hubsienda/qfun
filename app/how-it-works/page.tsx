import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'How QOOBIX IDAAS Works',
  description: 'The managed QOOBIX IDAAS intelligence-delivery process.'
};

const steps = [
  {
    title: 'Define the business and market question',
    text: 'The operator captures the analysed business, sector, product or service, target country, language, commercial objective, target clients, channels, known competitors and discovery scope.'
  },
  {
    title: 'Run the intelligence process',
    text: 'QOOBIX IDAAS structures the market question, analyses the commercial context and, where required, discovers candidate organisations for verification.'
  },
  {
    title: 'Review and refine',
    text: 'The operator reviews the output, checks relevance, removes unsuitable candidates and prepares the intelligence package.'
  },
  {
    title: 'Deliver the package',
    text: 'The client receives editable outputs such as DOCX reports, XLSX workbooks, RTF documents and CSV files.'
  }
];

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
  'Known competitors',
  'Known partners',
  'Discovery target',
  'Include categories',
  'Exclude categories',
  'Output format'
];

export default function HowItWorksPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">How it works</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
          A controlled route from market question to reviewed intelligence.
        </h1>
        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS is not a public self-service SaaS flow. It is an operator-led intelligence
          process designed to produce reviewed, editable outputs.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <Panel key={step.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--qoobix-orange)]">
              Step {index + 1}
            </p>
            <h2 className="mt-4 text-xl font-semibold tracking-[-0.025em]">{step.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--qoobix-muted)]">{step.text}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Panel strong>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">
            The job subject controls the analysis.
          </h2>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            QOOBIX IDAAS analyses the business defined in the job, not the account owner or operator.
            Sienda may analyse a restaurant. Naralimon may analyse a manufacturer. An Italy operator
            may analyse a Spanish hospitality business.
          </p>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold tracking-[-0.025em]">Required job definition</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {jobFields.map((field) => (
              <div key={field} className="rounded-xl border border-[var(--qoobix-border)] bg-white/52 px-4 py-3 text-sm font-semibold">
                {field}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-10">
        <ButtonLink href="/contact">Request an intelligence review</ButtonLink>
      </div>
    </section>
  );
}
