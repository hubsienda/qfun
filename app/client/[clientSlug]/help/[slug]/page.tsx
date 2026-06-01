import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { LegalMarkdown } from '@/components/LegalMarkdown';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug } from '@/lib/qoobix/db';
import { getHelpDocument, helpDocuments } from '@/lib/qoobix/help';

type ClientHelpDocumentPageProps = {
  params: Promise<{
    clientSlug: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ClientHelpDocumentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const document = getHelpDocument(slug);

  return {
    title: document?.title ?? 'Help',
    robots: {
      index: false,
      follow: false,
      nocache: true
    }
  };
}

export async function generateStaticParams() {
  return helpDocuments.map((document) => ({
    slug: document.slug
  }));
}

export default async function ClientHelpDocumentPage({ params }: ClientHelpDocumentPageProps) {
  const { clientSlug, slug } = await params;
  const sessionSlug = await getClientSessionSlug();

  if (sessionSlug !== clientSlug) {
    redirect('/access');
  }

  const client = await getClientBySlug(clientSlug);

  if (!client) {
    notFound();
  }

  const document = getHelpDocument(slug);

  if (!document) {
    notFound();
  }

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex justify-between gap-4">
        <Link
          href={`/client/${client.slug}/help`}
          className="font-semibold text-[var(--qoobix-orange)]"
        >
          ← Back to help
        </Link>

        <ClientLogoutButton />
      </div>

      <Panel className="p-7 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          Private help document
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{document.title}</h1>

        <div className="mt-8 border-t border-[var(--qoobix-border)] pt-8">
          <LegalMarkdown content={document.content} />
        </div>
      </Panel>
    </section>
  );
}
