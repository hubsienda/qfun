import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { Panel } from '@/components/Panel';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getResultByToken } from '@/lib/qoobix/db';
import { createSignedReportLinks } from '@/lib/qoobix/storage';

type ResultPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export const metadata = {
  title: 'Result'
};

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

        <div className="mt-6 rounded-md border border-[var(--qoobix-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--qoobix-muted)]">
          AI-assisted analysis may contain errors, omissions, outdated assumptions, or incomplete
          market information. Verify the files before using them for commercial, legal, technical,
          financial, or regulatory decisions. Generated files are retained temporarily; download and
          store anything you need to keep.
        </div>

        <div className="mt-8 space-y-4">
          {signedReports.map((report) => (
            <a
              key={report.id}
              href={report.downloadUrl}
              className="qoobix-focus-ring flex items-center justify-between rounded-md border border-[var(--qoobix-border)] bg-white/70 px-5 py-4 text-sm font-semibold hover:bg-white"
            >
              <span>{report.file_name}</span>
              <span className="text-[var(--qoobix-orange)]">{report.file_type.toUpperCase()}</span>
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
