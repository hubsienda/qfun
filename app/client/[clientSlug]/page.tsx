import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/ButtonLink';
import { Panel } from '@/components/Panel';
import { StatusPill } from '@/components/StatusPill';
import { getClientAreaData } from '@/lib/qoobix/db';
import type { JobStatus } from '@/lib/qoobix/types';

type ClientPageProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export async function generateMetadata({ params }: ClientPageProps) {
  const { clientSlug } = await params;

  return {
    title: `Client · ${clientSlug}`
  };
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { clientSlug } = await params;
  const data = await getClientAreaData(clientSlug);

  if (!data) {
    notFound();
  }

  const { client, jobs } = data;

  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
            Private client area
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{client.name}</h1>

          <p className="mt-4 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
            {client.sector}. Request structured market intelligence and download the outputs.
            The system stores the job, not the intelligence.
          </p>
        </div>

        <ButtonLink href={`/client/${client.slug}/new`}>New request</ButtonLink>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <h2 className="text-xl font-semibold">Configuration</h2>

          <dl className="mt-5 space-y-4 text-sm leading-7">
            <div>
              <dt className="font-semibold">Sector</dt>
              <dd className="text-[var(--qoobix-muted)]">{client.sector}</dd>
            </div>

            <div>
              <dt className="font-semibold">Target countries</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.targetCountries.length ? client.targetCountries.join(', ') : 'Not specified'}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Target channels</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.targetChannels.length ? client.targetChannels.join(', ') : 'Not specified'}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Report types</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.availableReportTypes.join(', ')}
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold">Previous jobs</h2>

          {jobs.length ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--qoobix-border)] text-left">
                    <th className="py-3 pr-4">Created</th>
                    <th className="py-3 pr-4">Question</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const request = job.request_metadata as { marketQuestion?: string };

                    return (
                      <tr key={job.id} className="border-b border-[var(--qoobix-border)]">
                        <td className="py-3 pr-4 text-[var(--qoobix-muted)]">
                          {new Date(job.created_at).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-3 pr-4">
                          {request.marketQuestion ?? 'Market intelligence request'}
                        </td>
                        <td className="py-3 pr-4">
                          <StatusPill status={job.status as JobStatus} />
                        </td>
                        <td className="py-3 pr-4">
                          <Link
                            href={`/job/${job.id}`}
                            className="font-semibold text-[var(--qoobix-orange)]"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-5 leading-7 text-[var(--qoobix-muted)]">
              No jobs yet. The lead museum is empty, as it should be.
            </p>
          )}
        </Panel>
      </div>
    </section>
  );
}
