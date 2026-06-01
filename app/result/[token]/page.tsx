import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { DataNotice } from '@/components/DataNotice';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getResultByToken } from '@/lib/qoobix/db';
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

function formatExpiryDate(value: string | null) {
  if (!value) {
    return 'Expiry not configured';
  }

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function fileLabel(fileType: string) {
  switch (fileType) {
    case 'docx':
      return 'Microsoft Word report';
    case 'xlsx':
      return 'Microsoft Excel workbook';
    case 'rtf':
      return 'Google Docs / universal editable report';
    case 'csv':
      return 'Google Sheets / CSV export';
    default:
      return fileType.toUpperCase();
  }
}

function fileHelp(fileType: string) {
  switch (fileType) {
    case 'docx':
      return 'Best for Microsoft Word.';
    case 'xlsx':
      return 'Best for Microsoft Excel.';
    case 'rtf':
      return 'Upload to Google Drive and open with Google Docs, or open with most word processors.';
    case 'csv':
      return 'Import into Google Sheets or Excel.';
    default:
      return 'Download file.';
  }
}

function groupReports(reports: SignedReport[]) {
  return {
    microsoft: reports.filter((report) => ['docx', 'xlsx'].includes(report.file_type)),
    google: reports.filter((report) => ['rtf', 'csv'].includes(report.file_type)),
    other: reports.filter((report) => !['docx', 'xlsx', 'rtf', 'csv'].includes(report.file_type))
  };
}

function ReportLink({ report }: { report: SignedReport }) {
  return (
    <a
      href={report.downloadUrl}
      className="qoobix-focus-ring flex flex-col gap-2 rounded-md border border-[var(--qoobix-border)] bg-white/70 px-5 py-4 text-sm font-semibold hover:bg-white sm:flex-row sm:items-center sm:justify-between"
    >
      <span>
        <span className="block">{fileLabel(report.file_type)}</span>
        <span className="mt-1 block text-xs font-medium text-[var(--qoobix-muted)]">
          {report.file_name}
        </span>
        <span className="mt-1 block text-xs font-medium text-[var(--qoobix-muted)]">
          {fileHelp(report.file_type)}
        </span>
      </span>

      <span className="flex flex-col gap-1 text-left sm:text-right">
        <span className="text-[var(--qoobix-orange)]">{report.file_type.toUpperCase()}</span>
        <span className="text-xs font-medium text-[var(--qoobix-muted)]">
          File expires: {formatExpiryDate(report.expires_at)}
        </span>
        <span className="text-xs font-medium text-[var(--qoobix-muted)]">
          Link valid for up to 4 hours
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

  const signedReports = await createSignedReportLinks(result.reports);
  const groupedReports = groupReports(signedReports);

  return (
    <section className="qoobix-narrow py-12 md:py-18">
      <div className="mb-6 flex justify-end">
        <ClientLogoutButton />
      </div>

      <Panel className="p-8 md:p-10">
        <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
          Intelligence ready
        </p>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Download the intelligence.
        </h1>

        <p className="mt-5 leading-8 text-[var(--qoobix-muted)]">
          Choose the format that matches the tool you want to use. DOCX and XLSX are prepared for
          Microsoft Office. RTF and CSV are provided for Google Docs and Google Sheets workflows.
        </p>

        <div className="mt-6">
          <DataNotice variant="full" />
        </div>

        <div className="mt-8 rounded-md border border-[var(--qoobix-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
          Download and store the files you need before their expiry date. The generated files are
          retained for the configured retention period. The download links shown here are temporary
          signed links and remain valid for up to 4 hours. Anyone who has one of those temporary
          links may open it until it expires.
        </div>

        <div className="mt-8 space-y-8">
          {groupedReports.microsoft.length ? (
            <section>
              <h2 className="text-xl font-semibold">Microsoft Office</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
                Use these files with Microsoft Word and Microsoft Excel.
              </p>
              <div className="mt-4 space-y-4">
                {groupedReports.microsoft.map((report) => (
                  <ReportLink key={report.id} report={report} />
                ))}
              </div>
            </section>
          ) : null}

          {groupedReports.google.length ? (
            <section>
              <h2 className="text-xl font-semibold">Google / universal formats</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">
                Use RTF for Google Docs and CSV for Google Sheets.
              </p>
              <div className="mt-4 space-y-4">
                {groupedReports.google.map((report) => (
                  <ReportLink key={report.id} report={report} />
                ))}
              </div>
            </section>
          ) : null}

          {groupedReports.other.length ? (
            <section>
              <h2 className="text-xl font-semibold">Other files</h2>
              <div className="mt-4 space-y-4">
                {groupedReports.other.map((report) => (
                  <ReportLink key={report.id} report={report} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="mt-8">
          <Link
            href={`/client/${result.client.slug}`}
            className="font-semibold text-[var(--qoobix-orange)]"
          >
            Back to client area →
          </Link>
        </div>
      </Panel>
    </section>
  );
}
