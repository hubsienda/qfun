import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LegalMarkdown } from '@/components/LegalMarkdown';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getLegalDocument, legalDocuments } from '@/lib/qoobix/legal';

type LegalDocumentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return legalDocuments.map((document) => ({
    slug: document.slug
  }));
}

export async function generateMetadata({ params }: LegalDocumentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getLegalDocument(slug);

  if (!document) {
    return {
      title: 'Legal'
    };
  }

  return {
    title: document.title,
    description: `${document.title} for QOOBIX.`
  };
}

export default async function LegalDocumentPage({ params }: LegalDocumentPageProps) {
  const { slug } = await params;
  const document = getLegalDocument(slug);
  const clientSlug = await getClientSessionSlug();

  if (!document) {
    notFound();
  }

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/legal" className="font-semibold text-[var(--qoobix-orange)]">
          ← Back to legal documents
        </Link>

        {clientSlug ? (
          <Link
            href={`/client/${clientSlug}`}
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold"
          >
            Back to client area
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

      <Panel className="p-7 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          Legal document
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{document.title}</h1>

        <div className="mt-6 rounded-md border border-[var(--qoobix-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
          <strong className="text-[var(--qoobix-text)]">Language notice.</strong> The English
          version of this document is the controlling version. Any translation, localised wording,
          simplified version, or summary is provided for convenience only and does not replace or
          modify the English legal text.
        </div>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-8">
          <LegalMarkdown content={document.content} />
        </div>
      </Panel>
    </section>
  );
}
