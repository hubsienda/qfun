import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ButtonLink } from '@/components/ButtonLink';
import { ClientAccessCodeForm } from '@/components/ClientAccessCodeForm';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { Panel } from '@/components/Panel';
import { StatusPill } from '@/components/StatusPill';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { getClientAreaData, isClientProfileComplete } from '@/lib/qoobix/db';
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
  const sessionSlug = await getClientSessionSlug();

  if (sessionSlug !== clientSlug) {
    redirect('/access');
  }

  const data = await getClientAreaData(clientSlug);

  if (!data) {
    notFound();
  }

  const { client, jobs } = data;
  const profileComplete = isClientProfileComplete(client);

  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
            Private client area
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{client.name}</h1>

          <p className="mt-4 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
            Complete the business profile, set your private access code, then request structured
            market intelligence and download the outputs.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/client/${client.slug}/profile`} variant="secondary">
            Edit business profile
          </ButtonLink>

          {profileComplete ? (
            <ButtonLink href={`/client/${client.slug}/new`}>New request</ButtonLink>
          ) : null}

          <ClientLogoutButton />
        </div>
      </div>

      {!profileComplete ? (
        <div className="mt-8 rounded-md border border-[var(--qoobix-orange)] bg-white/85 p-5">
          <h2 className="text-lg font-semibold">Business profile required</h2>
          <p className="mt-2 leading-7 text-[var(--qoobix-muted)]">
            Before QOOBIX can generate useful intelligence, the client must complete the business
            profile: sector, products/services, target countries, target channels, and known
            market context.
          </p>
          <div className="mt-4">
            <ButtonLink href={`/client/${client.slug}/profile`}>Complete business profile</ButtonLink>
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <h2 className="text-xl font-semibold">Business profile</h2>

          <dl className="mt-5 space-y-4 text-sm leading-7">
            <div>
              <dt className="font-semibold">Sector</dt>
              <dd className="text-[var(--qoobix-muted)]">{client.sector || 'Not configured'}</dd>
            </div>

            <div>
              <dt className="font-semibold">Website</dt>
              <dd className="text-[var(--qoobix-muted)]">{client.website || 'Not configured'}</dd>
            </div>

            <div>
              <dt className="font-semibold">Products/services</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.productsServices || 'Not configured'}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Target countries</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.targetCountries.length ? client.targetCountries.join(', ') : 'Not configured'}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Target customer types</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.targetCustomerTypes.length
                  ? client.targetCustomerTypes.join(', ')
                  : 'Not configured'}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">Target channels</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.targetChannels.length ? client.targetChannels.join(', ') : 'Not configured'}
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
              No jobs yet. Complete the business profile, then create the first request.
            </p>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel>
          <h2 className="text-xl font-semibold">Private access code</h2>
          <p className="mt-3 leading-7 text-[var(--qoobix-muted)]">
            Replace the temporary first-access code with a private code known only to you. QOOBIX
            stores a hash of the code, not the readable code.
          </p>

          <div className="mt-6">
            <ClientAccessCodeForm client={client} />
          </div>
        </Panel>
      </div>
    </section>
  );
}
