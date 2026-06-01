import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ButtonLink';
import { ClientAccessCodeForm } from '@/components/ClientAccessCodeForm';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';
import { DataNotice } from '@/components/DataNotice';
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

type ActionCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  primary?: boolean;
  disabled?: boolean;
};

export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
  const { clientSlug } = await params;

  return {
    title: `Client · ${clientSlug}`,
    robots: {
      index: false,
      follow: false,
      nocache: true
    }
  };
}

function ActionCard({
  href,
  eyebrow,
  title,
  description,
  primary = false,
  disabled = false
}: ActionCardProps) {
  if (disabled) {
    return (
      <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/35 p-5 opacity-60">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--qoobix-muted)]">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">{description}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`qoobix-focus-ring group block rounded-lg border p-5 transition ${
        primary
          ? 'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] shadow-sm hover:brightness-95'
          : 'border-[var(--qoobix-border)] bg-white/60 hover:border-[var(--qoobix-orange)] hover:bg-white'
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          primary ? 'text-white/80' : 'text-[var(--qoobix-orange)]'
        }`}
      >
        {eyebrow}
      </p>

      <h3 className={`mt-3 text-lg font-semibold ${primary ? 'text-white' : ''}`}>{title}</h3>

      <p className={`mt-2 text-sm leading-7 ${primary ? 'text-white/85' : 'text-[var(--qoobix-muted)]'}`}>
        {description}
      </p>

      <p className={`mt-4 text-sm font-semibold ${primary ? 'text-white' : 'text-[var(--qoobix-orange)]'}`}>
        Open →
      </p>
    </Link>
  );
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

  const readyJobs = jobs.filter((job) => job.status === 'ready').length;
  const activeJobs = jobs.filter((job) =>
    ['received', 'processing', 'generating_outputs'].includes(job.status)
  ).length;

  return (
    <section className="qoobix-container py-12 md:py-18">
      <div className="rounded-2xl border border-[var(--qoobix-border)] bg-white/55 p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-md border border-[var(--qoobix-orange)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--qoobix-orange)]">
              Private client area
            </p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{client.name}</h1>

            <p className="mt-4 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
              Manage the business profile, create intelligence requests, review previous jobs, and
              download generated outputs.
            </p>
          </div>

          <div className="flex lg:justify-end">
            <ClientLogoutButton />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-muted)]">
              Profile
            </p>
            <p className="mt-2 text-2xl font-semibold">{profileComplete ? 'Ready' : 'Incomplete'}</p>
          </div>

          <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-muted)]">
              Ready outputs
            </p>
            <p className="mt-2 text-2xl font-semibold">{readyJobs}</p>
          </div>

          <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-muted)]">
              Active jobs
            </p>
            <p className="mt-2 text-2xl font-semibold">{activeJobs}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DataNotice />
      </div>

      <div className="mt-8">
        <Panel className="p-6 md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="qoobix-kicker">Command centre</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">What do you want to do?</h2>
            </div>

            {!profileComplete ? (
              <p className="max-w-md text-sm leading-7 text-[var(--qoobix-muted)]">
                Complete the business profile before creating the first intelligence request.
              </p>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ActionCard
              href={`/client/${client.slug}/new`}
              eyebrow="Intelligence"
              title="New request"
              description="Create a structured market-intelligence job and generate downloadable outputs."
              primary
              disabled={!profileComplete}
            />

            <ActionCard
              href={`/client/${client.slug}/profile`}
              eyebrow="Configuration"
              title="Business profile"
              description="Review or update sector, products, markets, channels, competitors, and language."
            />

            <ActionCard
              href={`/client/${client.slug}/help`}
              eyebrow="Guidance"
              title="Help centre"
              description="Read the user guide, request examples, and private case studies."
            />
          </div>
        </Panel>
      </div>

      {!profileComplete ? (
        <div className="mt-8 rounded-lg border border-[var(--qoobix-orange)] bg-white/85 p-5">
          <h2 className="text-lg font-semibold">Business profile required</h2>
          <p className="mt-2 leading-7 text-[var(--qoobix-muted)]">
            Before QOOBIX can generate useful intelligence, the client must complete the business
            profile: sector, products/services, target countries, target channels, and known market
            context.
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
          <h2 className="text-xl font-semibold">Recovery phrase and access code</h2>
          <p className="mt-3 leading-7 text-[var(--qoobix-muted)]">
            Set a recovery phrase and let Proteus generate a private access code. The generated code
            is shown once. QOOBIX stores only hashes, not readable access codes or recovery phrases.
          </p>

          <div className="mt-6">
            <ClientAccessCodeForm client={client} />
          </div>
        </Panel>
      </div>
    </section>
  );
}
