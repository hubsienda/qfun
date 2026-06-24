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

function SoftMetric({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/48 p-4 shadow-[0_8px_22px_rgba(51,36,26,0.035)]">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--qoobix-muted)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--qoobix-text)]">
        {value}
      </p>
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
    <Panel strong className="p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="qoobix-kicker">{t.clientArea.licenceAndUsage}</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
            {unlimited ? t.clientArea.internalAccount : planLabel(usage.plan, t)}
          </h2>
          <p className="mt-3 leading-7 text-[var(--qoobix-muted)]">
            {unlimited ? t.clientArea.internalDescription : t.clientArea.normalLicenceDescription}
          </p>
        </div>

        <div className="inline-flex rounded-md border border-[var(--qoobix-border)] bg-white/64 px-4 py-2.5 text-sm font-semibold shadow-[0_8px_22px_rgba(51,36,26,0.04)]">
          {usage.isLicenceActive ? t.clientArea.licenceActive : t.clientArea.licenceInactive}
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SoftMetric
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

        <SoftMetric
          label={t.clientArea.licencePeriod}
          value={`${formatDate(usage.licenceStartsAt)} → ${formatDate(usage.licenceEndsAt)}`}
          helper={t.clientArea.jobsCountedInsidePeriod}
        />

        <SoftMetric
          label={t.clientArea.fileRetention}
          value={`${fileRetentionDays} days`}
          helper={t.clientArea.fileRetentionHelper}
        />

        <SoftMetric
          label={t.clientArea.totalJobs}
          value={usageLabel(usage.totalJobsUsed, usage.totalJobsAllowed, t, unlimited)}
          helper={t.clientArea.totalJobsHelper}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SoftMetric
          label={t.clientArea.analysisJobs}
          value={usageLabel(usage.analysisJobsUsed, usage.analysisJobsAllowed, t, unlimited)}
        />

        <SoftMetric
          label={t.clientArea.discoveryJobs}
          value={usageLabel(usage.discoveryJobsUsed, usage.discoveryJobsAllowed, t, unlimited)}
        />

        <SoftMetric
          label={t.clientArea.countriesPerDiscovery}
          value={unlimited ? t.common.unlimited : String(usage.maxCountriesPerDiscoveryJob)}
        />

        <SoftMetric
          label={t.clientArea.candidatesPerDiscovery}
          value={unlimited ? t.common.unlimited : String(usage.maxCandidatesPerDiscoveryJob)}
        />
      </div>

      {!unlimited ? (
        <p className="mt-5 max-w-4xl text-sm leading-7 text-[var(--qoobix-muted)]">
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
      <div className="rounded-xl border border-[var(--qoobix-border)] bg-white/34 p-5 opacity-60 shadow-[0_8px_22px_rgba(51,36,26,0.025)]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--qoobix-muted)]">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em]">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--qoobix-muted)]">{description}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`qoobix-focus-ring group block rounded-xl border p-5 transition duration-200 ${
        primary
          ? 'border-[var(--qoobix-orange)] bg-[var(--qoobix-orange)] shadow-[0_14px_34px_rgba(232,90,42,0.18)] hover:bg-[var(--qoobix-orange-dark)] hover:shadow-[0_18px_42px_rgba(232,90,42,0.22)]'
          : 'border-[var(--qoobix-border)] bg-white/50 shadow-[0_8px_22px_rgba(51,36,26,0.035)] hover:border-[var(--qoobix-border-strong)] hover:bg-white hover:shadow-[0_12px_30px_rgba(51,36,26,0.055)]'
      }`}
    >
      <p
        className={`text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
          primary ? 'text-white/78' : 'text-[var(--qoobix-orange)]'
        }`}
      >
        {eyebrow}
      </p>

      <h3 className={`mt-3 text-lg font-semibold tracking-[-0.02em] ${primary ? 'text-white' : ''}`}>
        {title}
      </h3>

      <p className={`mt-2 text-sm leading-7 ${primary ? 'text-white/84' : 'text-[var(--qoobix-muted)]'}`}>
        {description}
      </p>

      <p className={`mt-5 text-sm font-semibold ${primary ? 'text-white' : 'text-[var(--qoobix-orange)]'}`}>
        {openLabel} <span aria-hidden="true">→</span>
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
    <section className="qoobix-container py-10 md:py-16">
      <Panel strong className="p-6 md:p-9">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="qoobix-kicker">{t.clientArea.privateClientArea}</p>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] md:text-5xl">
              {client.name}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--qoobix-muted)]">
              {t.clientArea.intro}
            </p>
          </div>

          <div className="flex lg:justify-end">
            <ClientLogoutButton label={t.common.logout} loadingLabel={t.common.logout} />
          </div>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          <SoftMetric
            label={t.clientArea.profile}
            value={profileComplete ? t.clientArea.ready : t.clientArea.incomplete}
          />

          <SoftMetric label={t.clientArea.readyOutputs} value={String(readyJobs)} />

          <SoftMetric label={t.clientArea.activeJobs} value={String(activeJobs)} />
        </div>
      </Panel>

      <div className="mt-7">
        <LicencePanel usage={usage} fileRetentionDays={client.fileRetentionDays} t={t} />
      </div>

      <div className="mt-7">
        <DataNotice language={client.preferredLanguage} />
      </div>

      <div className="mt-7">
        <Panel className="p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="qoobix-kicker">{t.clientArea.commandCentre}</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
                {t.clientArea.whatDoYouWant}
              </h2>
            </div>

            {!profileComplete ? (
              <p className="max-w-md text-sm leading-7 text-[var(--qoobix-muted)]">
                {t.clientArea.completeProfileBeforeFirstRequest}
              </p>
            ) : null}
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
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
        <div className="mt-7 rounded-xl border border-[rgba(232,90,42,0.32)] bg-white/78 p-5 shadow-[0_12px_32px_rgba(232,90,42,0.075)]">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">
            {t.clientArea.businessProfileRequired}
          </h2>
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

      <div className="mt-9 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <Panel>
          <h2 className="text-xl font-semibold tracking-[-0.025em]">
            {t.clientArea.businessProfile}
          </h2>

          <dl className="mt-6 space-y-5 text-sm leading-7">
            <div>
              <dt className="font-semibold text-[var(--qoobix-text)]">{t.clientArea.sector}</dt>
              <dd className="mt-1 text-[var(--qoobix-muted)]">
                {client.sector || t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-[var(--qoobix-text)]">{t.clientArea.website}</dt>
              <dd className="mt-1 text-[var(--qoobix-muted)]">
                {client.website || t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-[var(--qoobix-text)]">
                {t.clientArea.productsServices}
              </dt>
              <dd className="mt-1 text-[var(--qoobix-muted)]">
                {client.productsServices || t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-[var(--qoobix-text)]">
                {t.clientArea.targetCountries}
              </dt>
              <dd className="mt-1 text-[var(--qoobix-muted)]">
                {client.targetCountries.length
                  ? client.targetCountries.join(', ')
                  : t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-[var(--qoobix-text)]">
                {t.clientArea.targetCustomerTypes}
              </dt>
              <dd className="mt-1 text-[var(--qoobix-muted)]">
                {client.targetCustomerTypes.length
                  ? client.targetCustomerTypes.join(', ')
                  : t.common.notConfigured}
              </dd>
            </div>

            <div>
              <dt className="font-semibold text-[var(--qoobix-text)]">
                {t.clientArea.targetChannels}
              </dt>
              <dd className="mt-1 text-[var(--qoobix-muted)]">
                {client.targetChannels.length
                  ? client.targetChannels.join(', ')
                  : t.common.notConfigured}
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold tracking-[-0.025em]">
            {t.clientArea.previousJobs}
          </h2>

          {jobs.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--qoobix-border)] text-left">
                    <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--qoobix-muted)]">
                      {t.clientArea.created}
                    </th>
                    <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--qoobix-muted)]">
                      {t.clientArea.question}
                    </th>
                    <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--qoobix-muted)]">
                      {t.clientArea.status}
                    </th>
                    <th className="py-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--qoobix-muted)]">
                      {t.common.open}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const request = job.request_metadata as { marketQuestion?: string };

                    return (
                      <tr
                        key={job.id}
                        className="border-b border-[var(--qoobix-border)] transition hover:bg-white/38"
                      >
                        <td className="py-3.5 pr-4 text-[var(--qoobix-muted)]">
                          {new Date(job.created_at).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-3.5 pr-4">
                          {request.marketQuestion ?? t.clientArea.marketIntelligenceRequest}
                        </td>
                        <td className="py-3.5 pr-4">
                          <StatusPill
                            status={job.status as JobStatus}
                            language={client.preferredLanguage}
                          />
                        </td>
                        <td className="py-3.5 pr-4">
                          <Link
                            href={`/job/${job.id}`}
                            className="font-semibold text-[var(--qoobix-orange)] transition hover:text-[var(--qoobix-orange-dark)]"
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
            <p className="mt-5 leading-7 text-[var(--qoobix-muted)]">{t.clientArea.noJobsYet}</p>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel>
          <h2 className="text-xl font-semibold tracking-[-0.025em]">
            {t.clientArea.recoveryTitle}
          </h2>
          <p className="mt-3 leading-7 text-[var(--qoobix-muted)]">{t.clientArea.recoveryText}</p>

          <div className="mt-6">
            <ClientAccessCodeForm client={client} />
          </div>
        </Panel>
      </div>
    </section>
  );
}
