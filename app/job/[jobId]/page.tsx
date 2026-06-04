import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { GenerateJobButton } from '@/components/GenerateJobButton';
import { Panel } from '@/components/Panel';
import { StatusPill } from '@/components/StatusPill';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getJobWithClientAndReports } from '@/lib/qoobix/db';
import { getOperationalDictionary } from '@/lib/qoobix/client-operational-i18n';
import type { JobStatus } from '@/lib/qoobix/types';

type JobPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { jobId } = await params;

  return {
    title: `Job · ${jobId}`,
    robots: {
      index: false,
      follow: false,
      nocache: true
    }
  };
}

function formatExpiryDate(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default async function JobPage({ params }: JobPageProps) {
  const { jobId } = await params;
  const sessionSlug = await getClientSessionSlug();

  if (!sessionSlug) {
    redirect('/access');
  }

  const data = await getJobWithClientAndReports(jobId);

  if (!data) {
    notFound();
  }

  const { job, client, reports } = data;

  if (sessionSlug !== client.slug) {
    redirect('/access');
  }

  const t = getOperationalDictionary(client);

  const request = job.request_metadata as {
    marketQuestion?: string;
    productOrService?: string;
    targetCountries?: string;
    commercialObjective?: string;
  };

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex justify-end">
        <ClientLogoutButton label={t.common.backToClientArea === 'Volver al área de cliente' ? 'Cerrar sesión' : t.common.backToClientArea === 'Torna all’area cliente' ? 'Esci' : 'Sign out'} />
      </div>

      <Panel className="p-8 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
              {t.jobPage.badge}
            </p>

            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {t.jobPage.title}
            </h1>

            <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">{client.name}</p>
          </div>

          <StatusPill status={job.status as JobStatus} language={client.preferredLanguage} />
        </div>

        <div className="mt-8 rounded-md border border-[var(--qoobix-border)] bg-white/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-orange)]">
            {t.jobPage.marketQuestion}
          </h2>

          <p className="mt-3 text-base leading-7 text-[var(--qoobix-text)]">
            {request.marketQuestion ?? t.jobPage.fallbackQuestion}
          </p>
        </div>

        <dl className="mt-8 space-y-4 text-sm leading-7">
          <div>
            <dt className="font-semibold">{t.jobPage.productService}</dt>
            <dd className="text-[var(--qoobix-muted)]">{request.productOrService ?? '—'}</dd>
          </div>

          <div>
            <dt className="font-semibold">{t.jobPage.targetCountries}</dt>
            <dd className="text-[var(--qoobix-muted)]">{request.targetCountries ?? '—'}</dd>
          </div>

          <div>
            <dt className="font-semibold">{t.jobPage.commercialObjective}</dt>
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
              style={{ color: '#ffffff' }}
              className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-5 py-3 text-sm font-semibold"
            >
              {t.jobPage.openResult}
            </Link>
          ) : (
            <GenerateJobButton jobId={job.id} labels={t.generateButton} />
          )}

          <Link
            href={`/client/${client.slug}`}
            className="qoobix-focus-ring inline-flex items-center justify-center rounded-md border border-[var(--qoobix-border)] bg-white/65 px-5 py-3 text-sm font-semibold"
          >
            {t.common.backToClient}
          </Link>
        </div>

        {reports.length ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold">{t.jobPage.generatedFiles}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
              {t.jobPage.generatedFilesText}
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {reports.map((report) => (
                <li
                  key={report.id}
                  className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3"
                >
                  <div className="font-semibold">{report.file_name}</div>
                  <div className="mt-1 text-xs text-[var(--qoobix-muted)]">
                    {report.file_type.toUpperCase()} · {t.jobPage.expires}:{' '}
                    {formatExpiryDate(report.expires_at, t.common.expiryNotConfigured)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Panel>
    </section>
  );
}
