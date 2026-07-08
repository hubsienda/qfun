import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'QOOBIX IDAAS Outputs',
  description: 'Reports, workbooks and verification outputs delivered by QOOBIX IDAAS.'
};

const outputs = [
  'Executive decision brief',
  'Market overview',
  'Demand signals to investigate',
  'Competitor, substitute and alternative landscape',
  'Candidate organisations for verification',
  'Regional or segment priorities',
  'Channel opportunities',
  'Positioning recommendations',
  'Commercial risks and caveats',
  'Action matrix',
  'Verification workflow',
  'DOCX report',
  'XLSX workbook',
  'RTF report',
  'CSV tables'
];

export default function OutputsPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">Outputs</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
          Editable intelligence packages, not dashboard captivity.
        </h1>
        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS delivers structured material that can be reviewed, shared, edited and used in
          practical commercial planning.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {outputs.map((output) => (
          <Panel key={output}>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">{output}</h2>
          </Panel>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Panel strong>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">Website and verification URL</h2>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            Candidate exports must include both Website and Verification URL where available. Website
            means the candidate organisation’s own website. Verification URL means Google Maps,
            Google Places, a directory URL, an official registry URL or another source used to verify
            the candidate.
          </p>
        </Panel>

        <Panel>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">No silent blanks</h2>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            If a discovery source supplies a business website, QOOBIX must capture and export it. If
            no website is available, the output should say “Not supplied” or “Not found in source”.
            This must be a real absence of data, not a mapping or export failure.
          </p>
        </Panel>
      </div>

      <div className="mt-10">
        <ButtonLink href="/contact">Request an intelligence review</ButtonLink>
      </div>
    </section>
  );
}
