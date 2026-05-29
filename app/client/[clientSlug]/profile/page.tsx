import { notFound } from 'next/navigation';
import { ClientProfileForm } from '@/components/ClientProfileForm';
import { Panel } from '@/components/Panel';
import { getClientBySlug } from '@/lib/qoobix/db';

type ClientProfilePageProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export async function generateMetadata({ params }: ClientProfilePageProps) {
  const { clientSlug } = await params;

  return {
    title: `Business profile · ${clientSlug}`
  };
}

export default async function ClientProfilePage({ params }: ClientProfilePageProps) {
  const { clientSlug } = await params;
  const client = await getClientBySlug(clientSlug);

  if (!client) {
    notFound();
  }

  return (
    <section className="qoobix-narrow py-12 md:py-18">
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
