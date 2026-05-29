import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { ReportRow } from '@/lib/qoobix/db';

const REPORT_BUCKET = 'qoobix-reports';

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

  const { data, error: signedError } = await supabase.storage
    .from(REPORT_BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24);

  if (signedError || !data) {
    throw new Error(signedError?.message ?? 'Could not create signed download URL.');
  }

  return {
    storagePath,
    signedUrl: data.signedUrl
  };
}

export async function createSignedReportLinks(reports: ReportRow[]) {
  const supabase = createSupabaseAdminClient();

  return Promise.all(
    reports.map(async (report) => {
      if (!report.storage_path) {
        return {
          ...report,
          downloadUrl: report.file_url
        };
      }

      const { data, error } = await supabase.storage
        .from(REPORT_BUCKET)
        .createSignedUrl(report.storage_path, 60 * 60);

      if (error || !data) {
        return {
          ...report,
          downloadUrl: report.file_url
        };
      }

      return {
        ...report,
        downloadUrl: data.signedUrl
      };
    })
  );
}
