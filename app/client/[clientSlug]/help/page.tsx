import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug } from '@/lib/qoobix/db';
import { getAllHelpDocuments } from '@/lib/qoobix/help';

type ClientHelpPageProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Help',
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default async function ClientHelpPage({ params }: ClientHelpPageProps) {
  const { clientSlug } = await params;
  const sessionSlug = await getClientSessionSlug();

  if (sessionSlug !== clientSlug) {
    redirect('/access');
  }

  const client = await getClientBySlug(clientSlug);

  if (!client) {
    notFound();
  }

  const documents = getAllHelpDocuments();

  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="mb-6 flex justify-end">
        <ClientLogoutButton />
      </div>

      <div className="max-w-3xl">
        <p className="qoobix-kicker">Private help centre</p>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
          QOOBIX help.
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          Guidance for using QOOBIX, creating better intelligence requests, and understanding
          practical examples. This area is available only inside the private client session.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {documents.map((document) => (
          <Panel key={document.slug}>
            <h2 className="text-xl font-semibold">{document.title}</h2>

            <p className="mt-3 text-sm leading-7 text-[var(--qoobix-muted)]">
              {document.description}
            </p>

            <div className="mt-5">
              <Link
                href={`/client/${client.slug}/help/${document.slug}`}
                className="font-semibold text-[var(--qoobix-orange)]"
              >
                Open →
              </Link>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-8">
        <Link href={`/client/${client.slug}`} className="font-semibold text-[var(--qoobix-orange)]">
          ← Back to client area
        </Link>
      </div>
    </section>
  );
}
