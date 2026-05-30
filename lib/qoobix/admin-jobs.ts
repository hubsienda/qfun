import { createSupabaseAdminClient } from '@/lib/supabase/admin';

type JobRow = {
  id: string;
  status: string;
};

function getSupabase() {
  return createSupabaseAdminClient() as any;
}

export async function cancelAdminJob(jobId: string): Promise<void> {
  const supabase = getSupabase();

  const { data: job, error: jobError } = (await supabase
    .from('jobs')
    .select('id, status')
    .eq('id', jobId)
    .single()) as {
    data: JobRow | null;
    error: { message: string } | null;
  };

  if (jobError || !job) {
    throw new Error(jobError?.message ?? 'Job not found.');
  }

  if (job.status === 'ready') {
    throw new Error('Ready jobs cannot be cancelled.');
  }

  if (job.status === 'failed') {
    throw new Error('Failed jobs do not need cancellation. Retry them instead.');
  }

  if (job.status === 'cancelled') {
    return;
  }

  const { error } = (await supabase
    .from('jobs')
    .update({
      status: 'cancelled',
      error_message: 'Cancelled by admin.'
    })
    .eq('id', jobId)) as {
    error: { message: string } | null;
  };

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from('job_logs').insert({
    job_id: jobId,
    level: 'warning',
    message: 'Job cancelled by admin.',
    details: null
  });
}
