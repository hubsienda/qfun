import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GenerateJobButton } from '@/components/GenerateJobButton';
import { Panel } from '@/components/Panel';
import { StatusPill } from '@/components/StatusPill';
import { getJobWithClientAndReports } from '@/lib/qoobix/db';
import type { JobStatus } from '@/lib/qoobix/types';

type JobPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function generateMetadata({ params }: JobPageProps) {
  const { jobId } = await params;

  return {
    title: `Job · ${jobId}`
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { jobId } = await params;
  const data = await getJobWithClientAndReports(jobId);

  if (!data) {
    notFound();
  }

  const { job, client, reports } = data;
  const request = job.request_metadata as {
    marketQuestion?: string;
    productOrService?: string;
    targetCountries?: string;
    commercialObjective?: string;
  };

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <Panel className="p-8 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
              Intelligence job
            </p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {request.marketQuestion ?? 'Market intelligence request'}
            </h1>

            <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">{client.name}</p>
          </div>

          <StatusPill status={job.status as JobStatus} />
        </div>

        <dl className="mt-8 space-y-4 text-sm leading-7">
          <div>
            <dt className="font-semibold">Product/service</dt>
            <dd className="text-[var(--qoobix-muted)]">{request.productOrService ?? '—'}</dd>
          </div>

          <div>
            <dt className="font-semibold">Target countries</dt>
            <dd className="text-[var(--qoobix-muted)]">{request.targetCountries ?? '—'}</dd>
          </div>

          <div>
            <dt className="font-semibold">Commercial objective</dt>
            <dd className="text-[var(--qoobix-muted)]">{request.commercialObjective ?? '—'}</dd>
          </div>
        </dl>

        {job.error_message ? (
          <p className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {job.error_message}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {job.status === 'ready' ? (
            <Link
              href={`/result/${job.result_token}`}
              className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-5 py-3 text-sm font-semibold text-white"
            >
              Open result
            </Link>
          ) : (
            <GenerateJobButton jobId={job.id} />
          )}

          <Link
            href={`/client/${client.slug}`}
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/65 px-5 py-3 text-sm font-semibold"
          >
            Back to client
          </Link>
        </div>

        {reports.length ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Generated files</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {reports.map((report) => (
                <li key={report.id}>
                  {report.file_name} · {report.file_type.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Panel>
    </section>
  );
}
