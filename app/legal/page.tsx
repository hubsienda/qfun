import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/Panel';
import { getAllLegalDocuments } from '@/lib/qoobix/legal';

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Legal documents, policies, notices, and disclaimers for QOOBIX.'
};

export default function LegalIndexPage() {
  const documents = getAllLegalDocuments();

  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="max-w-3xl">
        <p className="qoobix-kicker">Legal and data notices</p>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
          QOOBIX legal documents.
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          These documents explain the terms, privacy, cookies, AI-assisted analysis, report
          limitations, acceptable use, and refund position for QOOBIX.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {documents.map((document) => (
          <Panel key={document.slug}>
            <h2 className="text-xl font-semibold">{document.title}</h2>

            <p className="mt-3 text-sm leading-7 text-[var(--qoobix-muted)]">
              Effective date: {document.effectiveDate}
            </p>

            <div className="mt-5">
              <Link
                href={`/legal/${document.slug}`}
                className="font-semibold text-[var(--qoobix-orange)]"
              >
                Read document →
              </Link>
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}
