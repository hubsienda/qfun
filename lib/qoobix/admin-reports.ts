import { createSupabaseAdminClient } from '@/lib/supabase/admin';

type ReportRow = {
  id: string;
  created_at: string;
  job_id: string;
  file_type: string;
  file_name: string;
  file_url: string;
  storage_path: string | null;
  expires_at: string | null;
};

type JobRow = {
  id: string;
  client_id: string;
  status: string;
  result_token: string;
};

type ClientRow = {
  id: string;
  name: string;
  slug: string;
};

export type AdminReportSummary = {
  id: string;
  clientName: string;
  clientAccessName: string;
  jobId: string;
  jobStatus: string;
  resultToken: string | null;
  fileName: string;
  fileType: string;
  storagePath: string | null;
  createdAt: string;
  expiresAt: string | null;
  isExpired: boolean;
};

function getSupabase() {
  return createSupabaseAdminClient() as any;
}

export async function listAdminReports(): Promise<AdminReportSummary[]> {
  const supabase = getSupabase();

  const { data: reports, error: reportsError } = (await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(150)) as {
    data: ReportRow[] | null;
    error: { message: string } | null;
  };

  if (reportsError) {
    throw new Error(reportsError.message);
  }

  const { data: jobs, error: jobsError } = (await supabase.from('jobs').select('*')) as {
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

  const jobById = new Map((jobs ?? []).map((job) => [job.id, job]));
  const clientById = new Map((clients ?? []).map((client) => [client.id, client]));
  const now = Date.now();

  return (reports ?? []).map((report) => {
    const job = jobById.get(report.job_id);
    const client = job ? clientById.get(job.client_id) : null;
    const expiresAt = report.expires_at;
    const isExpired = Boolean(expiresAt && new Date(expiresAt).getTime() < now);

    return {
      id: report.id,
      clientName: client?.name ?? 'Unknown client',
      clientAccessName: client?.slug ?? '—',
      jobId: report.job_id,
      jobStatus: job?.status ?? 'unknown',
      resultToken: job?.status === 'ready' ? job.result_token : null,
      fileName: report.file_name,
      fileType: report.file_type,
      storagePath: report.storage_path,
      createdAt: report.created_at,
      expiresAt,
      isExpired
    };
  });
}
