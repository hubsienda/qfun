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
          These files are the output. QOOBIX does not keep a permanent lead database, competitor
          museum, or CRM-shaped swamp behind the curtain.
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

        <div className="mt-8 space-y-4">
          {signedReports.map((report) => (
            <a
              key={report.id}
              href={report.downloadUrl}
              className="qoobix-focus-ring flex flex-col gap-2 rounded-md border border-[var(--qoobix-border)] bg-white/70 px-5 py-4 text-sm font-semibold hover:bg-white sm:flex-row sm:items-center sm:justify-between"
            >
              <span>{report.file_name}</span>
              <span className="flex flex-col gap-1 text-left sm:text-right">
                <span className="text-[var(--qoobix-orange)]">
                  {report.file_type.toUpperCase()}
                </span>
                <span className="text-xs font-medium text-[var(--qoobix-muted)]">
                  File expires: {formatExpiryDate(report.expires_at)}
                </span>
                <span className="text-xs font-medium text-[var(--qoobix-muted)]">
                  Link valid for up to 4 hours
                </span>
              </span>
            </a>
          ))}
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
