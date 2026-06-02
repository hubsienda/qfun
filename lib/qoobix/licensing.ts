import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { IntelligenceRequest } from '@/lib/qoobix/types';

type ClientLicenceRow = {
  id: string;
  slug: string;
  qoobix_plan: 'analysis' | 'analysis_discovery';
  is_internal_account: boolean;
  licence_starts_at: string;
  licence_ends_at: string;
  max_analysis_jobs_per_year: number;
  max_discovery_jobs_per_year: number;
  max_total_jobs_per_year: number;
  max_countries_per_discovery_job: number;
  max_candidates_per_discovery_job: number;
  extra_analysis_job_credits: number;
  extra_discovery_job_credits: number;
  extra_country_credits: number;
  extra_candidate_pack_credits: number;
};

type JobUsageRow = {
  id: string;
  status: string;
  created_at: string;
  intelligence_mode: 'analysis' | 'discovery' | null;
  request_metadata: {
    intelligenceMode?: 'analysis' | 'discovery';
  } | null;
};

export type LicenceUsageSummary = {
  plan: 'analysis' | 'analysis_discovery';
  isInternalAccount: boolean;
  licenceStartsAt: string;
  licenceEndsAt: string;
  isLicenceActive: boolean;
  analysisJobsUsed: number;
  discoveryJobsUsed: number;
  totalJobsUsed: number;
  analysisJobsAllowed: number;
  discoveryJobsAllowed: number;
  totalJobsAllowed: number;
  maxCountriesPerDiscoveryJob: number;
  maxCandidatesPerDiscoveryJob: number;
  extraAnalysisJobCredits: number;
  extraDiscoveryJobCredits: number;
  extraCountryCredits: number;
  extraCandidatePackCredits: number;
};

function getSupabase() {
  return createSupabaseAdminClient() as any;
}

function splitCountries(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getJobMode(job: JobUsageRow) {
  return job.intelligence_mode ?? job.request_metadata?.intelligenceMode ?? 'analysis';
}

function isActiveLicence(client: ClientLicenceRow) {
  if (client.is_internal_account) {
    return true;
  }

  const now = new Date();
  const startsAt = new Date(`${client.licence_starts_at}T00:00:00.000Z`);
  const endsAt = new Date(`${client.licence_ends_at}T23:59:59.999Z`);

  return now >= startsAt && now <= endsAt;
}

export async function getClientLicenceUsage(clientId: string): Promise<LicenceUsageSummary> {
  const supabase = getSupabase();

  const { data: client, error: clientError } = (await supabase
    .from('clients')
    .select(
      [
        'id',
        'slug',
        'qoobix_plan',
        'is_internal_account',
        'licence_starts_at',
        'licence_ends_at',
        'max_analysis_jobs_per_year',
        'max_discovery_jobs_per_year',
        'max_total_jobs_per_year',
        'max_countries_per_discovery_job',
        'max_candidates_per_discovery_job',
        'extra_analysis_job_credits',
        'extra_discovery_job_credits',
        'extra_country_credits',
        'extra_candidate_pack_credits'
      ].join(',')
    )
    .eq('id', clientId)
    .single()) as {
    data: ClientLicenceRow | null;
    error: { message: string } | null;
  };

  if (clientError || !client) {
    throw new Error(clientError?.message ?? 'Client licence could not be loaded.');
  }

  const { data: jobs, error: jobsError } = (await supabase
    .from('jobs')
    .select('id,status,created_at,intelligence_mode,request_metadata')
    .eq('client_id', client.id)
    .gte('created_at', `${client.licence_starts_at}T00:00:00.000Z`)
    .lte('created_at', `${client.licence_ends_at}T23:59:59.999Z`)) as {
    data: JobUsageRow[] | null;
    error: { message: string } | null;
  };

  if (jobsError) {
    throw new Error(jobsError.message);
  }

  const chargeableJobs = (jobs ?? []).filter((job) => job.status !== 'cancelled');
  const analysisJobsUsed = chargeableJobs.filter((job) => getJobMode(job) === 'analysis').length;
  const discoveryJobsUsed = chargeableJobs.filter((job) => getJobMode(job) === 'discovery').length;

  const analysisJobsAllowed = client.is_internal_account
    ? 999999
    : client.max_analysis_jobs_per_year + client.extra_analysis_job_credits;

  const discoveryJobsAllowed = client.is_internal_account
    ? 999999
    : client.max_discovery_jobs_per_year + client.extra_discovery_job_credits;

  const totalJobsAllowed = client.is_internal_account
    ? 999999
    : client.max_total_jobs_per_year +
      client.extra_analysis_job_credits +
      client.extra_discovery_job_credits;

  const maxCountriesPerDiscoveryJob = client.is_internal_account
    ? 999999
    : client.max_countries_per_discovery_job + client.extra_country_credits;

  const maxCandidatesPerDiscoveryJob = client.is_internal_account
    ? 999999
    : client.max_candidates_per_discovery_job + client.extra_candidate_pack_credits * 100;

  return {
    plan: client.qoobix_plan,
    isInternalAccount: client.is_internal_account,
    licenceStartsAt: client.licence_starts_at,
    licenceEndsAt: client.licence_ends_at,
    isLicenceActive: isActiveLicence(client),
    analysisJobsUsed,
    discoveryJobsUsed,
    totalJobsUsed: chargeableJobs.length,
    analysisJobsAllowed,
    discoveryJobsAllowed,
    totalJobsAllowed,
    maxCountriesPerDiscoveryJob,
    maxCandidatesPerDiscoveryJob,
    extraAnalysisJobCredits: client.extra_analysis_job_credits,
    extraDiscoveryJobCredits: client.extra_discovery_job_credits,
    extraCountryCredits: client.extra_country_credits,
    extraCandidatePackCredits: client.extra_candidate_pack_credits
  };
}

export async function enforceClientJobAllowance(input: {
  clientId: string;
  request: IntelligenceRequest;
}): Promise<LicenceUsageSummary> {
  const usage = await getClientLicenceUsage(input.clientId);
  const mode = input.request.intelligenceMode ?? 'analysis';

  if (usage.isInternalAccount) {
    return usage;
  }

  if (!usage.isLicenceActive) {
    throw new Error(
      'This QOOBIX licence is not currently active. Please contact us to renew or reactivate the environment.'
    );
  }

  if (mode === 'discovery' && usage.plan !== 'analysis_discovery') {
    throw new Error(
      'Discovery Mode is not included in this QOOBIX plan. Please contact us to add Discovery access.'
    );
  }

  if (usage.totalJobsUsed >= usage.totalJobsAllowed) {
    throw new Error(
      'This QOOBIX environment has reached its annual job allowance. Please contact us to add an extra job pack.'
    );
  }

  if (mode === 'analysis' && usage.analysisJobsUsed >= usage.analysisJobsAllowed) {
    throw new Error(
      'This QOOBIX environment has reached its Analysis job allowance. Please contact us to add an extra Analysis job.'
    );
  }

  if (mode === 'discovery' && usage.discoveryJobsUsed >= usage.discoveryJobsAllowed) {
    throw new Error(
      'This QOOBIX environment has reached its Discovery job allowance. Please contact us to add an extra Discovery job.'
    );
  }

  if (mode === 'discovery') {
    const requestedCountries = splitCountries(input.request.targetCountries);

    if (requestedCountries.length > usage.maxCountriesPerDiscoveryJob) {
      throw new Error(
        `This Discovery request includes ${requestedCountries.length} countries, but the current allowance is ${usage.maxCountriesPerDiscoveryJob}. Please reduce the request or add an extra Discovery country.`
      );
    }
  }

  return usage;
}
