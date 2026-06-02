import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { DataNotice } from '@/components/DataNotice';
import { NewJobForm } from '@/components/NewJobForm';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug, isClientProfileComplete } from '@/lib/qoobix/db';
import { getClientDictionary } from '@/lib/qoobix/client-i18n';

type NewJobPageProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export async function generateMetadata({ params }: NewJobPageProps) {
  const { clientSlug } = await params;

  return {
    title: `New request · ${clientSlug}`,
    robots: {
      index: false,
      follow: false,
      nocache: true
    }
  };
}

export default async function NewJobPage({ params }: NewJobPageProps) {
  const { clientSlug } = await params;
  const sessionSlug = await getClientSessionSlug();

  if (sessionSlug !== clientSlug) {
    redirect('/access');
  }

  const client = await getClientBySlug(clientSlug);

  if (!client) {
    notFound();
  }

  const t = getClientDictionary(client);

  if (!isClientProfileComplete(client)) {
    return (
      <section className="qoobix-narrow py-12 md:py-18">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/client/${client.slug}`}
            className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/65 px-5 py-3 text-sm font-semibold"
          >
            {t.common.backToClientArea}
          </Link>

          <ClientLogoutButton />
        </div>

        <Panel className="p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
            {t.newRequestPage.profileRequiredBadge}
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t.newRequestPage.profileRequiredTitle}
          </h1>

          <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
            {t.newRequestPage.profileRequiredText}
          </p>

          <div className="mt-8">
            <Link
              href={`/client/${client.slug}/profile`}
              className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-5 py-3 text-sm font-semibold text-white"
            >
              {t.newRequestPage.completeBusinessProfile}
            </Link>
          </div>
        </Panel>
      </section>
    );
  }

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/client/${client.slug}`}
          className="qoobix-focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/65 px-5 py-3 text-sm font-semibold"
        >
          {t.common.backToClientArea}
        </Link>

        <ClientLogoutButton />
      </div>

      <Panel className="p-8 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          {t.newRequestPage.badge}
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{client.name}</h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">{t.newRequestPage.intro}</p>

        <div className="mt-6">
          <DataNotice />
        </div>

        <div className="mt-8">
          <NewJobForm client={client} />
        </div>
      </Panel>
    </section>
  );
}
