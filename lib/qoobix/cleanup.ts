import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const REPORT_BUCKET = 'qoobix-reports';

type ExpiredReportRow = {
  id: string;
  storage_path: string | null;
  expires_at: string | null;
};

export type CleanupExpiredReportsResult = {
  expiredRecordsFound: number;
  storageFilesDeleted: number;
  reportRecordsDeleted: number;
};

function getSupabase() {
  return createSupabaseAdminClient() as any;
}

export async function cleanupExpiredReports(): Promise<CleanupExpiredReportsResult> {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  const { data: expiredReports, error: selectError } = (await supabase
    .from('reports')
    .select('id, storage_path, expires_at')
    .not('expires_at', 'is', null)
    .lt('expires_at', now)) as {
    data: ExpiredReportRow[] | null;
    error: { message: string } | null;
  };

  if (selectError) {
    throw new Error(selectError.message);
  }

  const reports = expiredReports ?? [];
  const storagePaths = reports
    .map((report) => report.storage_path)
    .filter((path): path is string => Boolean(path));

  let storageFilesDeleted = 0;

  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage.from(REPORT_BUCKET).remove(storagePaths);

    if (storageError) {
      throw new Error(storageError.message);
    }

    storageFilesDeleted = storagePaths.length;
  }

  const reportIds = reports.map((report) => report.id);

  if (reportIds.length > 0) {
    const { error: deleteError } = await supabase.from('reports').delete().in('id', reportIds);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  return {
    expiredRecordsFound: reports.length,
    storageFilesDeleted,
    reportRecordsDeleted: reportIds.length
  };
}
