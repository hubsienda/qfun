import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LegalMarkdown } from '@/components/LegalMarkdown';
import { Panel } from '@/components/Panel';
import { getLegalDocument, legalDocuments } from '@/lib/qoobix/legal';

type LegalDocumentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

  if (!document) {
    notFound();
  }

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6">
        <Link href="/legal" className="font-semibold text-[var(--qoobix-orange)]">
          ← Back to legal documents
        </Link>
      </div>

      <Panel className="p-7 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          Legal document
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{document.title}</h1>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-8">
          <LegalMarkdown content={document.content} />
        </div>
      </Panel>
    </section>
  );
}
