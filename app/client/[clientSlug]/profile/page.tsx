import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { ClientProfileForm } from '@/components/ClientProfileForm';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug } from '@/lib/qoobix/db';
import { getClientDictionary } from '@/lib/qoobix/client-i18n';

type ClientProfilePageProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export async function generateMetadata({ params }: ClientProfilePageProps): Promise<Metadata> {
  const { clientSlug } = await params;

  return {
    title: `Business profile · ${clientSlug}`,
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

export default async function ClientProfilePage({ params }: ClientProfilePageProps) {
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

  return (
    <section className="qoobix-narrow py-10 md:py-16">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BackLink href={`/client/${client.slug}`} label={t.common.backToClientArea} />
        <ClientLogoutButton label={t.common.logout} loadingLabel={t.common.logout} />
      </div>

      <Panel strong className="p-6 md:p-9">
        <p className="qoobix-kicker">{t.profilePage.badge}</p>

        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
          {client.name}
        </h1>

        <p className="mt-5 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
          {t.profilePage.intro}
        </p>

        <div className="mt-8 rounded-[var(--qoobix-radius)] border border-[var(--qoobix-border)] bg-white/42 p-4 md:p-5">
          <ClientProfileForm client={client} />
        </div>
      </Panel>
    </section>
  );
}
