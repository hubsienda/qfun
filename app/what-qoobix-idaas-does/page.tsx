import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';

export const metadata: Metadata = {
  title: 'What QOOBIX IDAAS Does',
  description: 'What QOOBIX IDAAS can analyse and deliver as a managed market-intelligence service.'
};

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

const discoveryFields = [
  'Organisation name',
  'Category or type',
  'Country or region',
  'Website, where available',
  'Verification URL',
  'Relevance explanation',
  'Suggested verification action',
  'Notes',
  'Status as candidate for verification'
];

export default function WhatQOOBIXIDAASDoesPage() {
  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">What QOOBIX IDAAS does</p>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
          Structured intelligence before commercial commitment.
        </h1>
        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          QOOBIX IDAAS helps businesses understand markets before they expand, appoint
          distributors, approach partners, invest in campaigns or enter new regions. The client buys
          the intelligence outcome, not access to a raw tool.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability) => (
          <Panel key={capability}>
            <h2 className="text-xl font-semibold tracking-[-0.025em]">{capability}</h2>
          </Panel>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Panel strong>
          <h2 className="text-2xl font-semibold tracking-[-0.035em]">
            Discovery means candidates for verification.
          </h2>
          <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">
            When QOOBIX IDAAS performs discovery, it does not deliver guaranteed leads, confirmed
            prospects, approved partners or guaranteed distributors. It delivers candidate
            organisations for verification, reviewed and refined by the operator before delivery.
          </p>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold tracking-[-0.025em]">Candidate data may include</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {discoveryFields.map((field) => (
              <div key={field} className="rounded-xl border border-[var(--qoobix-border)] bg-white/52 px-4 py-3 text-sm font-semibold">
                {field}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-[var(--qoobix-muted)]">
            Website and verification URL are separate fields. A Google Maps or source URL must not
            be used as a substitute for the organisation website.
          </p>
        </Panel>
      </div>

      <div className="mt-10">
        <ButtonLink href="/contact">Request an intelligence review</ButtonLink>
      </div>
    </section>
  );
}
