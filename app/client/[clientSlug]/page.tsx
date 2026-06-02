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
import { getClientDictionary, type ClientDictionary } from '@/lib/qoobix/client-i18n';
import { getClientLicenceUsage } from '@/lib/qoobix/licensing';
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
  openLabel: string;
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

function formatDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString('en-GB');
}

function planLabel(plan: string, t: ClientDictionary) {
  if (plan === 'analysis_discovery') {
    return `QOOBIX ${t.clientArea.analysisDiscovery}`;
  }

  return `QOOBIX ${t.clientArea.analysis}`;
}

function usageLabel(used: number, allowed: number, t: ClientDictionary, unlimited = false) {
  if (unlimited) {
    return `${used} / ${t.common.unlimited}`;
  }

  return `${used} / ${allowed}`;
}

function UsageMetric({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {helper ? <p className="mt-2 text-xs leading-5 text-[var(--qoobix-muted)]">{helper}</p> : null}
    </div>
  );
}

function LicencePanel({
  usage,
  fileRetentionDays,
  t
}: {
  usage: Awaited<ReturnType<typeof getClientLicenceUsage>>;
  fileRetentionDays: number;
  t: ClientDictionary;
}) {
  const unlimited = usage.isInternalAccount;

  return (
    <Panel className="p-6 md:p-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="qoobix-kicker">{t.clientArea.licenceAndUsage}</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            {unlimited ? t.clientArea.internalAccount : planLabel(usage.plan, t)}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--qoobix-muted)]">
            {unlimited ? t.clientArea.internalDescription : t.clientArea.normalLicenceDescription}
          </p>
        </div>

        <div className="rounded-md border border-[var(--qoobix-border)] bg-white/70 px-4 py-3 text-sm font-semibold">
          {usage.isLicenceActive ? t.clientArea.licenceActive : t.clientArea.licenceInactive}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UsageMetric
          label={t.clientArea.plan}
          value={
            unlimited
              ? t.clientArea.internal
              : usage.plan === 'analysis_discovery'
                ? t.clientArea.analysisDiscovery
                : t.clientArea.analysis
          }
          helper={unlimited ? t.clientArea.limitsNotEnforced : t.clientArea.currentCommercialVersion}
        />

        <UsageMetric
          label={t.clientArea.licencePeriod}
          value={`${formatDate(usage.licenceStartsAt)} → ${formatDate(usage.licenceEndsAt)}`}
          helper={t.clientArea.jobsCountedInsidePeriod}
        />

        <UsageMetric
          label={t.clientArea.fileRetention}
          value={`${fileRetentionDays} days`}
          helper={t.clientArea.fileRetentionHelper}
        />

        <UsageMetric
          label={t.clientArea.totalJobs}
          value={usageLabel(usage.totalJobsUsed, usage.totalJobsAllowed, t, unlimited)}
          helper={t.clientArea.totalJobsHelper}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UsageMetric
          label={t.clientArea.analysisJobs}
          value={usageLabel(usage.analysisJobsUsed, usage.analysisJobsAllowed, t, unlimited)}
        />

        <UsageMetric
          label={t.clientArea.discoveryJobs}
          value={usageLabel(usage.discoveryJobsUsed, usage.discoveryJobsAllowed, t, unlimited)}
        />

        <UsageMetric
          label={t.clientArea.countriesPerDiscovery}
          value={unlimited ? t.common.unlimited : String(usage.maxCountriesPerDiscoveryJob)}
        />

        <UsageMetric
          label={t.clientArea.candidatesPerDiscovery}
          value={unlimited ? t.common.unlimited : String(usage.maxCandidatesPerDiscoveryJob)}
        />
      </div>

      {!unlimited ? (
        <p className="mt-5 text-sm leading-7 text-[var(--qoobix-muted)]">
          {t.clientArea.extrasNotice}
        </p>
      ) : null}
    </Panel>
  );
}

function ActionCard({
  href,
  eyebrow,
  title,
  description,
  openLabel,
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
        {openLabel} →
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
  const t = getClientDictionary(client);
  const usage = await getClientLicenceUsage(client.id);
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
              {t.clientArea.privateClientArea}
            </p>

            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{client.name}</h1>

            <p className="mt-4 max-w-2xl leading-8 text-[var(--qoobix-muted)]">
              {t.clientArea.intro}
            </p>
          </div>

          <div className="flex lg:justify-end">
            <ClientLogoutButton />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-muted)]">
              {t.clientArea.profile}
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {profileComplete ? t.clientArea.ready : t.clientArea.incomplete}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-muted)]">
              {t.clientArea.readyOutputs}
            </p>
            <p className="mt-2 text-2xl font-semibold">{readyJobs}</p>
          </div>

          <div className="rounded-lg border border-[var(--qoobix-border)] bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--qoobix-muted)]">
              {t.clientArea.activeJobs}
            </p>
            <p className="mt-2 text-2xl font-semibold">{activeJobs}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <LicencePanel usage={usage} fileRetentionDays={client.fileRetentionDays} t={t} />
      </div>

      <div className="mt-8">
        <DataNotice />
      </div>

      <div className="mt-8">
        <Panel className="p-6 md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="qoobix-kicker">{t.clientArea.commandCentre}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                {t.clientArea.whatDoYouWant}
              </h2>
            </div>

            {!profileComplete ? (
              <p className="max-w-md text-sm leading-7 text-[var(--qoobix-muted)]">
                {t.clientArea.completeProfileBeforeFirstRequest}
              </p>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ActionCard
              href={`/client/${client.slug}/new`}
              eyebrow={t.clientArea.actionIntelligence}
              title={t.clientArea.actionNewRequest}
              description={t.clientArea.actionNewRequestDescription}
              openLabel={t.common.open}
              primary
              disabled={!profileComplete}
            />

            <ActionCard
              href={`/client/${client.slug}/profile`}
              eyebrow={t.clientArea.actionConfiguration}
              title={t.clientArea.actionBusinessProfile}
              description={t.clientArea.actionBusinessProfileDescription}
              openLabel={t.common.open}
            />

            <ActionCard
              href={`/client/${client.slug}/help`}
              eyebrow={t.clientArea.actionGuidance}
              title={t.clientArea.actionHelpCentre}
              description={t.clientArea.actionHelpCentreDescription}
              openLabel={t.common.open}
            />
          </div>
        </Panel>
      </div>

      {!profileComplete ? (
        <div className="mt-8 rounded-lg border border-[var(--qoobix-orange)] bg-white/85 p-5">
          <h2 className="text-lg font-semibold">{t.clientArea.businessProfileRequired}</h2>
          <p className="mt-2 leading-7 text-[var(--qoobix-muted)]">
            {t.clientArea.businessProfileRequiredText}
          </p>
          <div className="mt-4">
            <ButtonLink href={`/client/${client.slug}/profile`}>
              {t.clientArea.completeBusinessProfile}
            </ButtonLink>
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <h2 className="text-xl font-semibold">{t.clientArea.businessProfile}</h2>

          <dl className="mt-5 space-y-4 text-sm leading-7">
            <div>
              <dt className="font-semibold">{t.clientArea.sector}</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.sector || t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">{t.clientArea.website}</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.website || t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">{t.clientArea.productsServices}</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.productsServices || t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">{t.clientArea.targetCountries}</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.targetCountries.length
                  ? client.targetCountries.join(', ')
                  : t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">{t.clientArea.targetCustomerTypes}</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.targetCustomerTypes.length
                  ? client.targetCustomerTypes.join(', ')
                  : t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold">{t.clientArea.targetChannels}</dt>
              <dd className="text-[var(--qoobix-muted)]">
                {client.targetChannels.length
                  ? client.targetChannels.join(', ')
                  : t.common.notConfigured}
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold">{t.clientArea.previousJobs}</h2>

          {jobs.length ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--qoobix-border)] text-left">
                    <th className="py-3 pr-4">{t.clientArea.created}</th>
                    <th className="py-3 pr-4">{t.clientArea.question}</th>
                    <th className="py-3 pr-4">{t.clientArea.status}</th>
                    <th className="py-3 pr-4">{t.common.open}</th>
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
                          {request.marketQuestion ?? t.clientArea.marketIntelligenceRequest}
                        </td>
                        <td className="py-3 pr-4">
                          <StatusPill status={job.status as JobStatus} />
                        </td>
                        <td className="py-3 pr-4">
                          <Link
                            href={`/job/${job.id}`}
                            className="font-semibold text-[var(--qoobix-orange)]"
                          >
                            {t.common.view}
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
              {t.clientArea.noJobsYet}
            </p>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel>
          <h2 className="text-xl font-semibold">{t.clientArea.recoveryTitle}</h2>
          <p className="mt-3 leading-7 text-[var(--qoobix-muted)]">
            {t.clientArea.recoveryText}
          </p>

          <div className="mt-6">
            <ClientAccessCodeForm client={client} />
          </div>
        </Panel>
      </div>
    </section>
  );
}
