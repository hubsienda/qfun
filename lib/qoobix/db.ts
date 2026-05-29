import { env } from '@/lib/config';
import { normaliseAccessCode } from '@/lib/auth/access-code';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/lib/supabase/types';
import type { AdminCreateClientInput, NewJobInput } from '@/lib/qoobix/forms';
import { createAccessCodeFromClientSlug } from '@/lib/qoobix/forms';
import type { ClientConfiguration, JobStatus } from '@/lib/qoobix/types';

type ClientRow = Database['public']['Tables']['clients']['Row'];
type JobRow = Database['public']['Tables']['jobs']['Row'];
type ReportRow = Database['public']['Tables']['reports']['Row'];

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

export async function getClientBySlug(slug: string): Promise<ClientConfiguration | null> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return mapClient(data);
}

export async function getClientByAccessCode(code: string): Promise<ClientConfiguration | null> {
  const supabase = createSupabaseAdminClient();
  const normalisedCode = normaliseAccessCode(code);

  const { data, error } = await supabase
    .from('access_codes')
    .select('*, clients(*)')
    .eq('code', normalisedCode)
    .eq('is_active', true)
    .single();

  if (error || !data || !data.clients) {
    return null;
  }

  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
    return null;
  }

  await supabase
    .from('access_codes')
    .update({
      last_used_at: new Date().toISOString()
    })
    .eq('id', data.id);

  return mapClient(data.clients as ClientRow);
}

export async function createClientWithAccessCode(input: AdminCreateClientInput) {
  const supabase = createSupabaseAdminClient();
  const accessCode = normaliseAccessCode(
    input.accessCode || createAccessCodeFromClientSlug(input.slug)
  );

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      name: input.name,
      slug: input.slug,
      sector: input.sector,
      description: input.description || null,
      website: input.website || null,
      products_services: input.productsServices || null,
      target_countries: input.targetCountries,
      target_customer_types: input.targetCustomerTypes,
      target_channels: input.targetChannels,
      known_competitors: input.knownCompetitors || null,
      known_representatives: input.knownRepresentatives || null,
      preferred_language: input.preferredLanguage,
      available_report_types: input.availableReportTypes.length
        ? input.availableReportTypes
        : ['docx', 'xlsx'],
      file_retention_days: input.fileRetentionDays
    })
    .select('*')
    .single();

  if (clientError || !client) {
    throw new Error(clientError?.message ?? 'Could not create client.');
  }

  const { error: accessError } = await supabase.from('access_codes').insert({
    client_id: client.id,
    code: accessCode,
    label: `${client.name} primary access`
  });

  if (accessError) {
    throw new Error(accessError.message);
  }

  return {
    client: mapClient(client),
    accessCode,
    clientUrl: `${env.QOOBIX_APP_URL}/client/${client.slug}`
  };
}

export async function getClientAreaData(slug: string): Promise<{
  client: ClientConfiguration;
  jobs: JobRow[];
} | null> {
  const supabase = createSupabaseAdminClient();
  const client = await getClientBySlug(slug);

  if (!client) {
    return null;
  }

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) {
    throw new Error(error.message);
  }

  return {
    client,
    jobs: jobs ?? []
  };
}

export async function createJob(input: NewJobInput): Promise<JobRow> {
  const supabase = createSupabaseAdminClient();

  const client = await getClientBySlug(input.clientSlug);

  if (!client || client.id !== input.clientId) {
    throw new Error('Client configuration could not be verified.');
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      client_id: input.clientId,
      status: 'received',
      request_metadata: input,
      result_token: crypto.randomUUID()
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Could not create job.');
  }

  await addJobLog(data.id, 'info', 'Job created.', {
    clientSlug: input.clientSlug,
    objective: input.commercialObjective
  });

  return data;
}

export async function getJobWithClientAndReports(jobId: string): Promise<{
  job: JobRow;
  client: ClientConfiguration;
  reports: ReportRow[];
} | null> {
  const supabase = createSupabaseAdminClient();

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (jobError || !job) {
    return null;
  }

  const { data: clientRow, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', job.client_id)
    .single();

  if (clientError || !clientRow) {
    return null;
  }

  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('*')
    .eq('job_id', job.id)
    .order('created_at', { ascending: true });

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
  const supabase = createSupabaseAdminClient();

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('result_token', token)
    .eq('status', 'ready')
    .single();

  if (jobError || !job) {
    return null;
  }

  const data = await getJobWithClientAndReports(job.id);

  return data;
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  errorMessage?: string | null
) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from('jobs')
    .update({
      status,
      error_message: errorMessage ?? null
    })
    .eq('id', jobId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function addReportRecord(input: {
  jobId: string;
  fileType: 'docx' | 'xlsx' | 'csv';
  fileName: string;
  fileUrl: string;
  storagePath: string;
  expiresAt: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from('reports').insert({
    job_id: input.jobId,
    file_type: input.fileType,
    file_name: input.fileName,
    file_url: input.fileUrl,
    storage_path: input.storagePath,
    expires_at: input.expiresAt
  });

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
  const supabase = createSupabaseAdminClient();

  await supabase.from('job_logs').insert({
    job_id: jobId,
    level,
    message,
    details: details ?? null
  });
}

export type { JobRow, ReportRow };
