import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { DataNotice } from '@/components/DataNotice';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getResultByToken } from '@/lib/qoobix/db';
import { getOperationalDictionary, type OperationalDictionary } from '@/lib/qoobix/client-operational-i18n';
import { createSignedReportLinks } from '@/lib/qoobix/storage';

type ResultPageProps = {
  params: Promise<{
    token: string;
  }>;
};

type SignedReport = Awaited<ReturnType<typeof createSignedReportLinks>>[number];

export const metadata: Metadata = {
  title: 'Result',
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

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

function fileLabel(fileType: string, t: OperationalDictionary) {
  return t.resultPage.labels[fileType] ?? fileType.toUpperCase();
}

function fileHelp(fileType: string, t: OperationalDictionary) {
  return t.resultPage.help[fileType] ?? 'Download file.';
}

function groupReports(reports: SignedReport[]) {
  return {
    microsoft: reports.filter((report) => ['docx', 'xlsx'].includes(report.file_type)),
    google: reports.filter((report) => ['rtf', 'csv'].includes(report.file_type)),
    other: reports.filter((report) => !['docx', 'xlsx', 'rtf', 'csv'].includes(report.file_type))
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

function ReportLink({ report, t }: { report: SignedReport; t: OperationalDictionary }) {
  return (
    <a
      href={report.downloadUrl}
      className="qoobix-focus-ring group flex flex-col gap-4 rounded-xl border border-[var(--qoobix-border)] bg-white/50 px-5 py-4 text-sm shadow-[0_8px_22px_rgba(51,36,26,0.035)] transition hover:border-[var(--qoobix-border-strong)] hover:bg-white hover:shadow-[0_12px_30px_rgba(51,36,26,0.055)] sm:flex-row sm:items-center sm:justify-between"
    >
      <span className="min-w-0">
        <span className="block text-base font-semibold tracking-[-0.02em] text-[var(--qoobix-text)]">
          {fileLabel(report.file_type, t)}
        </span>
        <span className="mt-1 block break-all text-xs font-medium leading-5 text-[var(--qoobix-muted)]">
          {report.file_name}
        </span>
        <span className="mt-2 block text-xs font-medium leading-5 text-[var(--qoobix-muted)]">
          {fileHelp(report.file_type, t)}
        </span>
      </span>

      <span className="flex shrink-0 flex-col gap-1 text-left sm:text-right">
        <span className="text-sm font-semibold text-[var(--qoobix-orange)]">
          {report.file_type.toUpperCase()}
        </span>
        <span className="text-xs font-medium leading-5 text-[var(--qoobix-muted)]">
          {t.resultPage.fileExpires}: {formatExpiryDate(report.expires_at, t.common.expiryNotConfigured)}
        </span>
        <span className="text-xs font-medium leading-5 text-[var(--qoobix-muted)]">
          {t.resultPage.linkValid}
        </span>
      </span>
    </a>
  );
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { token } = await params;
  const sessionSlug = await getClientSessionSlug();

  if (!sessionSlug) {
    redirect('/access');
  }

  const result = await getResultByToken(token);

  if (!result) {
    notFound();
  }

  if (sessionSlug !== result.client.slug) {
    redirect('/access');
  }

  const t = getOperationalDictionary(result.client);
  const signedReports = await createSignedReportLinks(result.reports);
  const groupedReports = groupReports(signedReports);

  return (
    <section className="qoobix-narrow py-10 md:py-16">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BackLink href={`/client/${result.client.slug}`} label={t.common.backToClientArea} />
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
        <p className="qoobix-kicker">{t.resultPage.badge}</p>

        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
          {t.resultPage.title}
        </h1>

        <p className="mt-5 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
          {t.resultPage.intro}
        </p>

        <div className="mt-7">
          <DataNotice variant="full" language={result.client.preferredLanguage} />
        </div>

        <div className="mt-8 rounded-xl border border-[var(--qoobix-border)] bg-white/46 p-5 text-sm leading-7 text-[var(--qoobix-muted)] shadow-[0_8px_22px_rgba(51,36,26,0.03)]">
          {t.resultPage.downloadNotice}
        </div>

        <div className="mt-9 space-y-9">
          {groupedReports.microsoft.length ? (
            <section>
              <h2 className="text-xl font-semibold tracking-[-0.025em]">
                {t.resultPage.microsoftOffice}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
                {t.resultPage.microsoftOfficeText}
              </p>
              <div className="mt-5 space-y-4">
                {groupedReports.microsoft.map((report) => (
                  <ReportLink key={report.id} report={report} t={t} />
                ))}
              </div>
            </section>
          ) : null}

          {groupedReports.google.length ? (
            <section>
              <h2 className="text-xl font-semibold tracking-[-0.025em]">
                {t.resultPage.googleUniversal}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
                {t.resultPage.googleUniversalText}
              </p>
              <div className="mt-5 space-y-4">
                {groupedReports.google.map((report) => (
                  <ReportLink key={report.id} report={report} t={t} />
                ))}
              </div>
            </section>
          ) : null}

          {groupedReports.other.length ? (
            <section>
              <h2 className="text-xl font-semibold tracking-[-0.025em]">
                {t.resultPage.otherFiles}
              </h2>
              <div className="mt-5 space-y-4">
                {groupedReports.other.map((report) => (
                  <ReportLink key={report.id} report={report} t={t} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </Panel>
    </section>
  );
}
