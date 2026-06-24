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

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/62 px-4 py-2.5 text-sm font-semibold shadow-[0_8px_22px_rgba(51,36,26,0.04)] transition hover:border-[var(--qoobix-border-strong)] hover:bg-white"
    >
      ← {label}
    </Link>
  );
}

function PrimaryLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{ color: '#ffffff' }}
      className="qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-4 py-2.5 text-sm font-semibold shadow-[0_12px_28px_rgba(232,90,42,0.18)] transition hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_16px_34px_rgba(232,90,42,0.22)]"
    >
      {label}
    </Link>
  );
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
      <section className="qoobix-narrow py-10 md:py-16">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <BackLink href={`/client/${client.slug}`} label={t.common.backToClientArea} />
          <ClientLogoutButton label={t.common.logout} loadingLabel={t.common.logout} />
        </div>

        <Panel strong className="p-6 md:p-9">
          <p className="qoobix-kicker">{t.newRequestPage.profileRequiredBadge}</p>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
            {t.newRequestPage.profileRequiredTitle}
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
            {t.newRequestPage.profileRequiredText}
          </p>

          <div className="mt-8">
            <PrimaryLink
              href={`/client/${client.slug}/profile`}
              label={t.newRequestPage.completeBusinessProfile}
            />
          </div>
        </Panel>
      </section>
    );
  }

  return (
    <section className="qoobix-narrow py-10 md:py-16">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BackLink href={`/client/${client.slug}`} label={t.common.backToClientArea} />
        <ClientLogoutButton label={t.common.logout} loadingLabel={t.common.logout} />
      </div>

      <Panel strong className="p-6 md:p-9">
        <p className="qoobix-kicker">{t.newRequestPage.badge}</p>

        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
          {client.name}
        </h1>

        <p className="mt-5 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
          {t.newRequestPage.intro}
        </p>

        <div className="mt-7">
          <DataNotice language={client.preferredLanguage} />
        </div>

        <div className="mt-8 rounded-[var(--qoobix-radius)] border border-[var(--qoobix-border)] bg-white/42 p-4 md:p-5">
          <NewJobForm client={client} />
        </div>
      </Panel>
    </section>
  );
}
