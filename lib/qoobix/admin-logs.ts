import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/lib/qoobix/types';

type JobLogRow = {
  id: string;
  created_at: string;
  job_id: string | null;
  level: string;
  message: string;
  details: Json | null;
};

type JobRow = {
  id: string;
  client_id: string;
  status: string;
};

type ClientRow = {
  id: string;
  name: string;
  slug: string;
};

export type AdminLogSummary = {
  id: string;
  createdAt: string;
  level: string;
  message: string;
  details: Json | null;
  jobId: string | null;
  jobStatus: string | null;
  clientName: string | null;
  clientAccessName: string | null;
};

function getSupabase() {
  return createSupabaseAdminClient() as any;
}

export async function listAdminLogs(): Promise<AdminLogSummary[]> {
  const supabase = getSupabase();

  const { data: logs, error: logsError } = (await supabase
    .from('job_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)) as {
    data: JobLogRow[] | null;
    error: { message: string } | null;
  };

  if (logsError) {
    throw new Error(logsError.message);
  }

  const { data: jobs, error: jobsError } = (await supabase.from('jobs').select('id, client_id, status')) as {
    data: JobRow[] | null;
    error: { message: string } | null;
  };

  if (jobsError) {
    throw new Error(jobsError.message);
  }

  const { data: clients, error: clientsError } = (await supabase
    .from('clients')
    .select('id, name, slug')) as {
    data: ClientRow[] | null;
    error: { message: string } | null;
  };

  if (clientsError) {
    throw new Error(clientsError.message);
  }

  const jobById = new Map((jobs ?? []).map((job) => [job.id, job]));
  const clientById = new Map((clients ?? []).map((client) => [client.id, client]));

  return (logs ?? []).map((log) => {
    const job = log.job_id ? jobById.get(log.job_id) : null;
    const client = job ? clientById.get(job.client_id) : null;

    return {
      id: log.id,
      createdAt: log.created_at,
      level: log.level,
      message: log.message,
      details: log.details,
      jobId: log.job_id,
      jobStatus: job?.status ?? null,
      clientName: client?.name ?? null,
      clientAccessName: client?.slug ?? null
    };
  });
}
