import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { ClientProfileForm } from '@/components/ClientProfileForm';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientBySlug } from '@/lib/qoobix/db';

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

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/client/${client.slug}`}
          className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/65 px-5 py-3 text-sm font-semibold"
        >
          Back to client area
        </Link>

        <ClientLogoutButton />
      </div>

      <Panel className="p-8 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          Business profile
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{client.name}</h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          This profile gives QOOBIX the stable business context it needs before generating
          request-specific intelligence.
        </p>

        <div className="mt-8">
          <ClientProfileForm client={client} />
        </div>
      </Panel>
    </section>
  );
}
