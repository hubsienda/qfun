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

function ReportLink({ report, t }: { report: SignedReport; t: OperationalDictionary }) {
  return (
    <a
      href={report.downloadUrl}
      className="qoobix-focus-ring flex flex-col gap-2 rounded-md border border-[var(--qoobix-border)] bg-white/70 px-5 py-4 text-sm font-semibold hover:bg-white sm:flex-row sm:items-center sm:justify-between"
    >
      <span>
        <span className="block">{fileLabel(report.file_type, t)}</span>
        <span className="mt-1 block text-xs font-medium text-[var(--qoobix-muted)]">
          {report.file_name}
        </span>
        <span className="mt-1 block text-xs font-medium text-[var(--qoobix-muted)]">
          {fileHelp(report.file_type, t)}
        </span>
      </span>

      <span className="flex flex-col gap-1 text-left sm:text-right">
        <span className="text-[var(--qoobix-orange)]">{report.file_type.toUpperCase()}</span>
        <span className="text-xs font-medium text-[var(--qoobix-muted)]">
          {t.resultPage.fileExpires}: {formatExpiryDate(report.expires_at, t.common.expiryNotConfigured)}
        </span>
        <span className="text-xs font-medium text-[var(--qoobix-muted)]">
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
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex justify-end">
        <ClientLogoutButton label={t.common.backToClientArea === 'Volver al área de cliente' ? 'Cerrar sesión' : t.common.backToClientArea === 'Torna all’area cliente' ? 'Esci' : 'Sign out'} />
      </div>

      <Panel className="p-8 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          {t.resultPage.badge}
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t.resultPage.title}
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">{t.resultPage.intro}</p>

        <div className="mt-6">
          <DataNotice variant="full" language={result.client.preferredLanguage} />
        </div>

        <div className="mt-8 rounded-md border border-[var(--qoobix-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
          {t.resultPage.downloadNotice}
        </div>

        <div className="mt-8 space-y-8">
          {groupedReports.microsoft.length ? (
            <section>
              <h2 className="text-xl font-semibold">{t.resultPage.microsoftOffice}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
                {t.resultPage.microsoftOfficeText}
              </p>
              <div className="mt-4 space-y-4">
                {groupedReports.microsoft.map((report) => (
                  <ReportLink key={report.id} report={report} t={t} />
                ))}
              </div>
            </section>
          ) : null}

          {groupedReports.google.length ? (
            <section>
              <h2 className="text-xl font-semibold">{t.resultPage.googleUniversal}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
                {t.resultPage.googleUniversalText}
              </p>
              <div className="mt-4 space-y-4">
                {groupedReports.google.map((report) => (
                  <ReportLink key={report.id} report={report} t={t} />
                ))}
              </div>
            </section>
          ) : null}

          {groupedReports.other.length ? (
            <section>
              <h2 className="text-xl font-semibold">{t.resultPage.otherFiles}</h2>
              <div className="mt-4 space-y-4">
                {groupedReports.other.map((report) => (
                  <ReportLink key={report.id} report={report} t={t} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="mt-8">
          <Link href={`/client/${result.client.slug}`} className="font-semibold text-[var(--qoobix-orange)]">
            {t.common.backToClientArea} →
          </Link>
        </div>
      </Panel>
    </section>
  );
}
