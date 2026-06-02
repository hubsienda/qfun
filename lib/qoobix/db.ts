import { env } from '@/lib/config';
import {
  hashAccessCode,
  hashRecoveryPhrase,
  normaliseAccessCode
} from '@/lib/auth/access-code';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/lib/supabase/types';
import type {
  AccessRecoveryInput,
  AdminCreateClientInput,
  ClientAccessCodeInput,
  ClientProfileInput,
  NewJobInput
} from '@/lib/qoobix/forms';
import { createAccessCodeFromClientSlug } from '@/lib/qoobix/forms';
import { enforceClientJobAllowance } from '@/lib/qoobix/licensing';
import type {
  ClientConfiguration,
  DiscoveryCandidate,
  DiscoveryUsage,
  JobStatus
} from '@/lib/qoobix/types';

type ClientRow = Database['public']['Tables']['clients']['Row'];
type AccessCodeRow = Database['public']['Tables']['access_codes']['Row'];
type JobRow = Database['public']['Tables']['jobs']['Row'];
type ReportRow = Database['public']['Tables']['reports']['Row'];

export type AdminClientSummary = {
  id: string;
  name: string;
  slug: string;
  sector: string;
  preferredLanguage: string;
  isActive: boolean;
  createdAt: string;
  jobCount: number;
  failedJobCount: number;
  latestJobStatus: string | null;
  latestJobCreatedAt: string | null;
};

export type AdminJobSummary = {
  id: string;
  clientName: string;
  clientSlug: string;
  status: string;
  createdAt: string;
  marketQuestion: string;
  commercialObjective: string;
  resultToken: string | null;
  errorMessage: string | null;
};

function getSupabase() {
  return createSupabaseAdminClient() as any;
}

function mapClient(row: ClientRow): ClientConfiguration {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sector: row.sector,
    description: row.description,
    website: row.website,
    productsServices: row.products_services,
    targetCountries: row.target_countries,
    targetCustomerTypes: row.target_customer_types,
    targetChannels: row.target_channels,
    knownCompetitors: row.known_competitors,
    knownRepresentatives: row.known_representatives,
    preferredLanguage: row.preferred_language,
    availableReportTypes: row.available_report_types,
    fileRetentionDays: row.file_retention_days
  };
}

export function isClientProfileComplete(client: ClientConfiguration): boolean {
  return Boolean(
    client.sector &&
      client.sector !== 'Not configured' &&
      client.productsServices &&
      client.targetCountries.length > 0
  );
}

export async function getClientBySlug(slug: string): Promise<ClientConfiguration | null> {
  const supabase = getSupabase();

  const { data, error } = (await supabase
    .from('clients')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()) as {
    data: ClientRow | null;
    error: { message: string } | null;
  };

  if (error || !data) {
    return null;
  }

  return mapClient(data);
}

export async function getClientByAccessCode(code: string): Promise<ClientConfiguration | null> {
  const supabase = getSupabase();
  const normalisedCode = normaliseAccessCode(code);
  const codeHash = hashAccessCode(normalisedCode);

  const { data: hashedAccessCode } = (await supabase
    .from('access_codes')
    .select('*')
    .eq('code_hash', codeHash)
    .eq('is_active', true)
    .single()) as {
    data: AccessCodeRow | null;
    error: { message: string } | null;
  };

  let accessCode = hashedAccessCode;

  if (!accessCode) {
    const { data: legacyAccessCode } = (await supabase
      .from('access_codes')
      .select('*')
      .eq('code', normalisedCode)
      .eq('is_active', true)
      .single()) as {
      data: AccessCodeRow | null;
      error: { message: string } | null;
    };

    accessCode = legacyAccessCode;
  }

  if (!accessCode) {
    return null;
  }

  if (accessCode.expires_at && new Date(accessCode.expires_at).getTime() < Date.now()) {
    return null;
  }

  const { data: client, error: clientError } = (await supabase
    .from('clients')
    .select('*')
    .eq('id', accessCode.client_id)
    .eq('is_active', true)
    .single()) as {
    data: ClientRow | null;
    error: { message: string } | null;
  };

  if (clientError || !client) {
    return null;
  }

  await supabase
    .from('access_codes')
    .update({
      last_used_at: new Date().toISOString()
    })
    .eq('id', accessCode.id);

  return mapClient(client);
}

export async function createClientWithAccessCode(input: AdminCreateClientInput) {
  const supabase = getSupabase();
  const temporaryAccessCode = normaliseAccessCode(createAccessCodeFromClientSlug(input.slug));

  const { data: client, error: clientError } = (await supabase
    .from('clients')
    .insert({
      name: input.name,
      slug: input.slug,
      sector: 'Not configured',
      description: null,
      website: null,
      products_services: null,
      target_countries: [],
      target_customer_types: [],
      target_channels: [],
      known_competitors: null,
      known_representatives: null,
      preferred_language: input.preferredLanguage,
      available_report_types: input.availableReportTypes.length
        ? input.availableReportTypes
        : ['docx', 'xlsx', 'rtf', 'csv'],
      file_retention_days: input.fileRetentionDays
    })
    .select('*')
    .single()) as {
    data: ClientRow | null;
    error: { message: string } | null;
  };

  if (clientError || !client) {
    throw new Error(clientError?.message ?? 'Could not create client.');
  }

  const { error: accessCodeError } = (await supabase.from('access_codes').insert({
    client_id: client.id,
    code: temporaryAccessCode,
    code_hash: hashAccessCode(temporaryAccessCode),
    recovery_phrase_hash: null,
    label: `${client.name} temporary first access`
  })) as {
    error: { message: string } | null;
  };

  if (accessCodeError) {
    throw new Error(accessCodeError.message);
  }

  return {
    client: mapClient(client),
    accessCode: temporaryAccessCode,
    clientUrl: `${env.QOOBIX_APP_URL}/client/${client.slug}`
  };
}

export async function listAdminClients(): Promise<AdminClientSummary[]> {
  const supabase = getSupabase();

  const { data: clients, error: clientsError } = (await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })) as {
    data: ClientRow[] | null;
    error: { message: string } | null;
  };

  if (clientsError) {
    throw new Error(clientsError.message);
  }

  const { data: jobs, error: jobsError } = (await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(250)) as {
    data: JobRow[] | null;
    error: { message: string } | null;
  };

  if (jobsError) {
    throw new Error(jobsError.message);
  }

  const allJobs = jobs ?? [];

  return (clients ?? []).map((client) => {
    const clientJobs = allJobs.filter((job) => job.client_id === client.id);
    const latestJob = clientJobs[0] ?? null;

    return {
      id: client.id,
      name: client.name,
      slug: client.slug,
      sector: client.sector,
      preferredLanguage: client.preferred_language,
      isActive: client.is_active,
      createdAt: client.created_at,
      jobCount: clientJobs.length,
      failedJobCount: clientJobs.filter((job) => job.status === 'failed').length,
      latestJobStatus: latestJob?.status ?? null,
      latestJobCreatedAt: latestJob?.created_at ?? null
    };
  });
}

export async function listAdminJobs(): Promise<AdminJobSummary[]> {
  const supabase = getSupabase();

  const { data: jobs, error: jobsError } = (await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)) as {
    data: JobRow[] | null;
    error: { message: string } | null;
  };

  if (jobsError) {
    throw new Error(jobsError.message);
  }

  const { data: clients, error: clientsError } = (await supabase.from('clients').select('*')) as {
    data: ClientRow[] | null;
    error: { message: string } | null;
  };

  if (clientsError) {
    throw new Error(clientsError.message);
  }

  const clientById = new Map((clients ?? []).map((client) => [client.id, client]));

  return (jobs ?? []).map((job) => {
    const client = clientById.get(job.client_id);
    const request = job.request_metadata as {
      marketQuestion?: string;
      commercialObjective?: string;
    };

    return {
      id: job.id,
      clientName: client?.name ?? 'Unknown client',
      clientSlug: client?.slug ?? '',
      status: job.status,
      createdAt: job.created_at,
      marketQuestion: request.marketQuestion ?? 'Market intelligence request',
      commercialObjective: request.commercialObjective ?? '—',
      resultToken: job.status === 'ready' ? job.result_token : null,
      errorMessage: job.error_message
    };
  });
}

export async function setClientActiveStatus(input: {
  clientId: string;
  isActive: boolean;
}): Promise<void> {
  const supabase = getSupabase();

  const { error } = (await supabase
    .from('clients')
    .update({
      is_active: input.isActive
    })
    .eq('id', input.clientId)) as {
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }

  if (!input.isActive) {
    await supabase
      .from('access_codes')
      .update({
        is_active: false
      })
      .eq('client_id', input.clientId);
  }
}

export async function issueTemporaryAccessCode(clientId: string): Promise<{
  accessCode: string;
  clientSlug: string;
  clientName: string;
  clientUrl: string;
}> {
  const supabase = getSupabase();

  const { data: client, error: clientError } = (await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single()) as {
    data: ClientRow | null;
    error: { message: string } | null;
  };

  if (clientError || !client) {
    throw new Error(clientError?.message ?? 'Client not found.');
  }

  if (!client.is_active) {
    throw new Error('Cannot issue an access code for a suspended client.');
  }

  const temporaryAccessCode = normaliseAccessCode(createAccessCodeFromClientSlug(client.slug));

  await supabase
    .from('access_codes')
    .update({
      is_active: false
    })
    .eq('client_id', client.id);

  const { error: insertError } = (await supabase.from('access_codes').insert({
    client_id: client.id,
    code: temporaryAccessCode,
    code_hash: hashAccessCode(temporaryAccessCode),
    recovery_phrase_hash: null,
    label: `${client.name} temporary reset access`,
    is_active: true
  })) as {
    error: { message: string } | null;
  };

  if (insertError) {
    throw new Error(insertError.message);
  }

  return {
    accessCode: temporaryAccessCode,
    clientSlug: client.slug,
    clientName: client.name,
    clientUrl: `${env.QOOBIX_APP_URL}/client/${client.slug}`
  };
}

export async function rotateClientAccessCode(input: ClientAccessCodeInput): Promise<{
  accessCode: string;
}> {
  const supabase = getSupabase();
  const client = await getClientBySlug(input.clientSlug);

  if (!client) {
    throw new Error('Client not found.');
  }

  const verifiedClient = await getClientByAccessCode(input.currentAccessCode);

  if (!verifiedClient || verifiedClient.id !== client.id) {
    throw new Error('Current access code is not valid for this client.');
  }

  const generatedAccessCode = normaliseAccessCode(createAccessCodeFromClientSlug(client.slug));
  const generatedAccessCodeHash = hashAccessCode(generatedAccessCode);
  const recoveryPhraseHash = hashRecoveryPhrase(input.recoveryPhrase);

  await supabase
    .from('access_codes')
    .update({
      is_active: false
    })
    .eq('client_id', client.id);

  const { error } = (await supabase.from('access_codes').insert({
    client_id: client.id,
    code: null,
    code_hash: generatedAccessCodeHash,
    recovery_phrase_hash: recoveryPhraseHash,
    label: `${client.name} private client access`,
    is_active: true,
    last_used_at: new Date().toISOString()
  })) as {
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }

  return {
    accessCode: generatedAccessCode
  };
}

export async function recoverClientAccessCode(input: AccessRecoveryInput): Promise<{
  clientSlug: string;
  accessCode: string;
}> {
  const supabase = getSupabase();
  const client = await getClientBySlug(input.clientSlug);

  if (!client) {
    throw new Error('Client not found or suspended.');
  }

  const recoveryPhraseHash = hashRecoveryPhrase(input.recoveryPhrase);

  const { data: accessCode, error: accessError } = (await supabase
    .from('access_codes')
    .select('*')
    .eq('client_id', client.id)
    .eq('recovery_phrase_hash', recoveryPhraseHash)
    .eq('is_active', true)
    .single()) as {
    data: AccessCodeRow | null;
    error: { message: string } | null;
  };

  if (accessError || !accessCode) {
    throw new Error('Recovery phrase not recognised for this client.');
  }

  const generatedAccessCode = normaliseAccessCode(createAccessCodeFromClientSlug(client.slug));
  const generatedAccessCodeHash = hashAccessCode(generatedAccessCode);

  await supabase
    .from('access_codes')
    .update({
      is_active: false
    })
    .eq('client_id', client.id);

  const { error } = (await supabase.from('access_codes').insert({
    client_id: client.id,
    code: null,
    code_hash: generatedAccessCodeHash,
    recovery_phrase_hash: recoveryPhraseHash,
    label: `${client.name} recovered private client access`,
    is_active: true,
    last_used_at: new Date().toISOString()
  })) as {
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }

  return {
    clientSlug: client.slug,
    accessCode: generatedAccessCode
  };
}

export async function updateClientProfile(input: ClientProfileInput): Promise<ClientConfiguration> {
  const supabase = getSupabase();

  const { data, error } = (await supabase
    .from('clients')
    .update({
      sector: input.sector,
      description: input.description || null,
      website: input.website || null,
      products_services: input.productsServices || null,
      target_countries: input.targetCountries,
      target_customer_types: input.targetCustomerTypes,
      target_channels: input.targetChannels,
      known_competitors: input.knownCompetitors || null,
      known_representatives: input.knownRepresentatives || null,
      preferred_language: input.preferredLanguage
    })
    .eq('slug', input.clientSlug)
    .eq('is_active', true)
    .select('*')
    .single()) as {
    data: ClientRow | null;
    error: { message: string } | null;
  };

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not update client profile.');
  }

  return mapClient(data);
}

export async function getClientAreaData(slug: string): Promise<{
  client: ClientConfiguration;
  jobs: JobRow[];
} | null> {
  const supabase = getSupabase();
  const client = await getClientBySlug(slug);

  if (!client) {
    return null;
  }

  const { data: jobs, error } = (await supabase
    .from('jobs')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })
    .limit(25)) as {
    data: JobRow[] | null;
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }

  return {
    client,
    jobs: jobs ?? []
  };
}

export async function createJob(input: NewJobInput): Promise<JobRow> {
  const supabase = getSupabase();

  const client = await getClientBySlug(input.clientSlug);

  if (!client || client.id !== input.clientId) {
    throw new Error('Client configuration could not be verified.');
  }

  if (!isClientProfileComplete(client)) {
    throw new Error('Please complete the business profile before creating an intelligence job.');
  }

  const intelligenceMode = input.intelligenceMode ?? 'analysis';

  const usage = await enforceClientJobAllowance({
    clientId: input.clientId,
    request: {
      ...input,
      intelligenceMode
    }
  });

  const { data, error } = (await supabase
    .from('jobs')
    .insert({
      client_id: input.clientId,
      status: 'received',
      intelligence_mode: intelligenceMode,
      discovery_status: intelligenceMode === 'discovery' ? 'pending' : 'not_required',
      request_metadata: input,
      result_token: crypto.randomUUID()
    })
    .select('*')
    .single()) as {
    data: JobRow | null;
    error: { message: string } | null;
  };

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not create job.');
  }

  await addJobLog(data.id, 'info', 'Job created.', {
    clientSlug: input.clientSlug,
    objective: input.commercialObjective,
    intelligenceMode,
    plan: usage.plan,
    licenceEndsAt: usage.licenceEndsAt,
    analysisJobsUsedBeforeCreation: usage.analysisJobsUsed,
    discoveryJobsUsedBeforeCreation: usage.discoveryJobsUsed,
    totalJobsUsedBeforeCreation: usage.totalJobsUsed,
    analysisJobsAllowed: usage.analysisJobsAllowed,
    discoveryJobsAllowed: usage.discoveryJobsAllowed,
    totalJobsAllowed: usage.totalJobsAllowed
  });

  return data;
}

export async function getJobWithClientAndReports(jobId: string): Promise<{
  job: JobRow;
  client: ClientConfiguration;
  reports: ReportRow[];
} | null> {
  const supabase = getSupabase();

  const { data: job, error: jobError } = (await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()) as {
    data: JobRow | null;
    error: { message: string } | null;
  };

  if (jobError || !job) {
    return null;
  }

  const { data: clientRow, error: clientError } = (await supabase
    .from('clients')
    .select('*')
    .eq('id', job.client_id)
    .single()) as {
    data: ClientRow | null;
    error: { message: string } | null;
  };

  if (clientError || !clientRow) {
    return null;
  }

  const { data: reports, error: reportsError } = (await supabase
    .from('reports')
    .select('*')
    .eq('job_id', job.id)
    .order('created_at', { ascending: true })) as {
    data: ReportRow[] | null;
    error: { message: string } | null;
  };

  if (reportsError) {
    throw new Error(reportsError.message);
  }

  return {
    job,
    client: mapClient(clientRow),
    reports: reports ?? []
  };
}

export async function getResultByToken(token: string): Promise<{
  job: JobRow;
  client: ClientConfiguration;
  reports: ReportRow[];
} | null> {
  const supabase = getSupabase();

  const { data: job, error: jobError } = (await supabase
    .from('jobs')
    .select('*')
    .eq('result_token', token)
    .eq('status', 'ready')
    .single()) as {
    data: JobRow | null;
    error: { message: string } | null;
  };

  if (jobError || !job) {
    return null;
  }

  return getJobWithClientAndReports(job.id);
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  errorMessage?: string | null
) {
  const supabase = getSupabase();

  const { error } = (await supabase
    .from('jobs')
    .update({
      status,
      error_message: errorMessage ?? null
    })
    .eq('id', jobId)) as {
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }
}

export async function addReportRecord(input: {
  jobId: string;
  fileType: 'docx' | 'xlsx' | 'rtf' | 'csv';
  fileName: string;
  fileUrl: string;
  storagePath: string;
  expiresAt: string | null;
}) {
  const supabase = getSupabase();

  const { error } = (await supabase.from('reports').insert({
    job_id: input.jobId,
    file_type: input.fileType,
    file_name: input.fileName,
    file_url: input.fileUrl,
    storage_path: input.storagePath,
    expires_at: input.expiresAt
  })) as {
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateJobDiscoveryStatus(input: {
  jobId: string;
  discoveryStatus: 'not_required' | 'pending' | 'running' | 'completed' | 'failed';
  usage?: Partial<DiscoveryUsage>;
}) {
  const supabase = getSupabase();

  const updatePayload: Record<string, unknown> = {
    discovery_status: input.discoveryStatus
  };

  if (input.usage) {
    if (typeof input.usage.textSearchCallsUsed === 'number') {
      updatePayload.places_text_search_calls_used = input.usage.textSearchCallsUsed;
    }

    if (typeof input.usage.placeDetailsCallsUsed === 'number') {
      updatePayload.places_details_calls_used = input.usage.placeDetailsCallsUsed;
    }

    if (typeof input.usage.candidateOrganisationsRetained === 'number') {
      updatePayload.candidate_organisations_found = input.usage.candidateOrganisationsRetained;
    }
  }

  const { error } = (await supabase.from('jobs').update(updatePayload).eq('id', input.jobId)) as {
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }
}

export async function replaceJobCandidates(input: {
  jobId: string;
  candidates: DiscoveryCandidate[];
}) {
  const supabase = getSupabase();

  await supabase.from('job_candidates').delete().eq('job_id', input.jobId);

  if (!input.candidates.length) {
    return;
  }

  const rows = input.candidates.map((candidate) => ({
    job_id: input.jobId,
    name: candidate.name,
    website: candidate.website,
    formatted_address: candidate.formattedAddress,
    country_or_region: candidate.countryOrRegion,
    place_id: candidate.placeId,
    business_categories: candidate.businessCategories,
    candidate_type: candidate.candidateType,
    source: candidate.source,
    relevance_reason: candidate.relevanceReason,
    suggested_action: candidate.suggestedAction,
    confidence: candidate.confidence,
    verification_status: candidate.verificationStatus,
    raw_metadata: candidate
  }));

  const { error } = (await supabase.from('job_candidates').insert(rows)) as {
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }
}

export async function addJobLog(
  jobId: string | null,
  level: 'info' | 'warning' | 'error',
  message: string,
  details?: Record<string, unknown>
) {
  const supabase = getSupabase();

  await supabase.from('job_logs').insert({
    job_id: jobId,
    level,
    message,
    details: details ?? null
  });
}

export type { JobRow, ReportRow };
