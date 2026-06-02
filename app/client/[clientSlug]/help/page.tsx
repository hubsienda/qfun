import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug } from '@/lib/qoobix/db';
import { getClientLocale } from '@/lib/qoobix/client-i18n';
import { getHelpDictionary } from '@/lib/qoobix/client-help-i18n';
import { getAllHelpDocuments } from '@/lib/qoobix/help';

type ClientHelpPageProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export const dynamic = 'force-dynamic';

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

  const locale = getClientLocale(client);
  const t = getHelpDictionary(client);
  const documents = getAllHelpDocuments(locale);

  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/client/${client.slug}`} className="font-semibold text-[var(--qoobix-orange)]">
          ← {t.helpIndex.backToClientArea}
        </Link>

        <ClientLogoutButton />
      </div>

      <div className="max-w-3xl">
        <p className="qoobix-kicker">{t.helpIndex.kicker}</p>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">
          {t.helpIndex.title}
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">{t.helpIndex.intro}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {documents.map((document) => (
          <Panel key={document.slug} className="p-6">
            <div className="flex h-full flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--qoobix-orange)]">
                {t.helpIndex.cardKicker}
              </p>

              <h2 className="mt-4 text-xl font-semibold">{document.title}</h2>

              <p className="mt-3 flex-1 text-sm leading-7 text-[var(--qoobix-muted)]">
                {document.description}
              </p>

              <div className="mt-6">
                <Link
                  href={`/client/${client.slug}/help/${document.slug}`}
                  className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-2 text-sm font-semibold hover:border-[var(--qoobix-orange)] hover:text-[var(--qoobix-orange)]"
                >
                  {t.helpIndex.openDocument} →
                </Link>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}
