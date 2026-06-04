import Link from 'next/link';
import type { Metadata } from 'next';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getAllLegalDocuments } from '@/lib/qoobix/legal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Legal documents, policies, notices, and disclaimers for QOOBIX.'
};

export default async function LegalIndexPage() {
  const documents = getAllLegalDocuments();
  const clientSlug = await getClientSessionSlug();

  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {clientSlug ? (
          <Link
            href={`/client/${clientSlug}`}
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            ← Back to client area
          </Link>
        ) : (
          <Link
            href="/access"
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            Client access
          </Link>
        )}
      </div>

      <div className="max-w-3xl">
        <p className="qoobix-kicker">Legal and data notices</p>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
          QOOBIX legal documents.
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          These documents explain the terms, privacy, cookies, AI-assisted analysis, report
          limitations, acceptable use, and refund position for QOOBIX.
        </p>

        <div className="mt-6 rounded-md border border-[var(--qoobix-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
          <strong className="text-[var(--qoobix-text)]">Language notice.</strong> The English
          version of the QOOBIX legal documents is the controlling version. Any translation,
          localised wording, simplified version, or summary is provided for convenience only and does
          not replace or modify the English legal text.
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {documents.map((document) => (
          <Panel key={document.slug}>
            <h2 className="text-xl font-semibold">{document.title}</h2>

            <p className="mt-3 text-sm leading-7 text-[var(--qoobix-muted)]">
              Read the current QOOBIX {document.title.toLowerCase()}.
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
