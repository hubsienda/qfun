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
    <section className="qoobix-narrow py-10 md:py-16">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BackLink href={`/client/${client.slug}`} label={t.common.backToClient} />
        <ClientLogoutButton
          label={
            t.common.backToClientArea === 'Volver al área de cliente'
              ? 'Cerrar sesión'
              : t.common.backToClientArea === 'Torna all’area cliente'
                ? 'Esci'
                : 'Sign out'
          }
        />
      </div>

      <Panel strong className="p-6 md:p-9">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="qoobix-kicker">{t.jobPage.badge}</p>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
              {t.jobPage.title}
            </h1>

            <p className="mt-4 leading-8 text-[var(--qoobix-muted)]">{client.name}</p>
          </div>

          <StatusPill status={job.status as JobStatus} language={client.preferredLanguage} />
        </div>

        <div className="mt-8 rounded-xl border border-[var(--qoobix-border)] bg-white/46 p-5 shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-orange)]">
            {t.jobPage.marketQuestion}
          </h2>

          <p className="mt-3 text-base leading-8 text-[var(--qoobix-text)]">
            {request.marketQuestion ?? t.jobPage.fallbackQuestion}
          </p>
        </div>

        <dl className="mt-8 grid gap-5 text-sm leading-7 md:grid-cols-3">
          <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/40 p-4">
            <dt className="font-semibold text-[var(--qoobix-text)]">{t.jobPage.productService}</dt>
            <dd className="mt-2 text-[var(--qoobix-muted)]">{request.productOrService ?? '—'}</dd>
          </div>

          <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/40 p-4">
            <dt className="font-semibold text-[var(--qoobix-text)]">{t.jobPage.targetCountries}</dt>
            <dd className="mt-2 text-[var(--qoobix-muted)]">{request.targetCountries ?? '—'}</dd>
          </div>

          <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/40 p-4">
            <dt className="font-semibold text-[var(--qoobix-text)]">
              {t.jobPage.commercialObjective}
            </dt>
            <dd className="mt-2 text-[var(--qoobix-muted)]">
              {request.commercialObjective ?? '—'}
            </dd>
          </div>
        </dl>

        {job.error_message ? (
          <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {job.error_message}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {job.status === 'ready' ? (
            <Link
              href={`/result/${job.result_token}`}
              style={{ color: '#ffffff' }}
              className="qoobix-focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] px-4 py-2.5 text-sm font-semibold shadow-[0_12px_28px_rgba(232,90,42,0.18)] transition hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_16px_34px_rgba(232,90,42,0.22)]"
            >
              {t.jobPage.openResult}
            </Link>
          ) : (
            <GenerateJobButton jobId={job.id} labels={t.generateButton} />
          )}

          <BackLink href={`/client/${client.slug}`} label={t.common.backToClient} />
        </div>

        {reports.length ? (
          <div className="mt-9">
            <h2 className="text-xl font-semibold tracking-[-0.025em]">
              {t.jobPage.generatedFiles}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
              {t.jobPage.generatedFilesText}
            </p>

            <ul className="mt-5 space-y-3 text-sm">
              {reports.map((report) => (
                <li
                  key={report.id}
                  className="rounded-xl border border-[var(--qoobix-border)] bg-white/46 px-4 py-3 shadow-[0_8px_22px_rgba(51,36,26,0.03)]"
                >
                  <div className="font-semibold text-[var(--qoobix-text)]">{report.file_name}</div>
                  <div className="mt-1 text-xs leading-5 text-[var(--qoobix-muted)]">
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
