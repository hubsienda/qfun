import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { ReportRow } from '@/lib/qoobix/db';

const REPORT_BUCKET = 'qoobix-reports';
const SIGNED_DOWNLOAD_URL_SECONDS = 60 * 60 * 4;

type UploadGeneratedReportInput = {
  jobId: string;
  fileName: string;
  contentType: string;
  buffer: Buffer;
};

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

  return Promise.all(
    reports.map(async (report) => {
      if (!report.storage_path) {
        return {
          ...report,
          downloadUrl: report.file_url,
          signedUrlExpiresInSeconds: SIGNED_DOWNLOAD_URL_SECONDS
        };
      }

      const { data, error } = await supabase.storage
        .from(REPORT_BUCKET)
        .createSignedUrl(report.storage_path, SIGNED_DOWNLOAD_URL_SECONDS);

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
