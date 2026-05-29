import { notFound } from 'next/navigation';
import { NewJobForm } from '@/components/NewJobForm';
import { Panel } from '@/components/Panel';
import { getClientBySlug } from '@/lib/qoobix/db';

type NewJobPageProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export async function generateMetadata({ params }: NewJobPageProps) {
  const { clientSlug } = await params;

  return {
    title: `New request · ${clientSlug}`
  };
}

export default async function NewJobPage({ params }: NewJobPageProps) {
  const { clientSlug } = await params;
  const client = await getClientBySlug(clientSlug);

  if (!client) {
    notFound();
  }

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <Panel className="p-8 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          New intelligence request
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{client.name}</h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          Describe the product, country, channel, and commercial question. QOOBIX will create a
          job and generate downloadable DOCX/XLSX outputs.
        </p>

        <div className="mt-8">
          <NewJobForm client={client} />
        </div>
      </Panel>
    </section>
  );
}
