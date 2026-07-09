import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { ReportRow } from '@/lib/qoobix/db';

export const REPORT_BUCKET = 'qoobix-reports';
const SIGNED_DOWNLOAD_URL_SECONDS = 60 * 60 * 4;

type UploadGeneratedReportInput = {
  jobId: string;
  fileName: string;
  contentType: string;
  buffer: Buffer;
};

export function deduplicateReportRows<T extends Pick<ReportRow, 'job_id' | 'file_type' | 'file_name' | 'created_at'>>(
  reports: T[]
): T[] {
  const latestByKey = new Map<string, T>();

  for (const report of reports) {
    const key = `${report.job_id}::${report.file_type}::${report.file_name}`;
    const existing = latestByKey.get(key);

    if (!existing || new Date(report.created_at).getTime() >= new Date(existing.created_at).getTime()) {
      latestByKey.set(key, report);
    }
  }

  return Array.from(latestByKey.values());
}

export async function uploadGeneratedReport(input: UploadGeneratedReportInput) {
  const supabase = createSupabaseAdminClient();
  const storagePath = `${input.jobId}/${input.fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(REPORT_BUCKET)
    .upload(storagePath, input.buffer, {
      contentType: input.contentType,
      upsert: true
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  return {
    storagePath,
    fileUrl: storagePath
  };
}

export async function createSignedReportLinks(reports: ReportRow[]) {
  const supabase = createSupabaseAdminClient();
  const uniqueReports = deduplicateReportRows(reports);

  return Promise.all(
    uniqueReports.map(async (report) => {
      if (!report.storage_path) {
        return {
          ...report,
          downloadUrl: report.file_url,
          signedUrlExpiresInSeconds: SIGNED_DOWNLOAD_URL_SECONDS
        };
      }

      const signOptions =
        report.file_type === 'md'
          ? {
              download: report.file_name
            }
          : undefined;

      const { data, error } = await supabase.storage
        .from(REPORT_BUCKET)
        .createSignedUrl(report.storage_path, SIGNED_DOWNLOAD_URL_SECONDS, signOptions);

      if (error || !data) {
        return {
          ...report,
          downloadUrl: report.file_url,
          signedUrlExpiresInSeconds: SIGNED_DOWNLOAD_URL_SECONDS
        };
      }

      return {
        ...report,
        downloadUrl: data.signedUrl,
        signedUrlExpiresInSeconds: SIGNED_DOWNLOAD_URL_SECONDS
      };
    })
  );
}
