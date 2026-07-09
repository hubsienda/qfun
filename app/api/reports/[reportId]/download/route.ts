import { NextRequest, NextResponse } from 'next/server';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { REPORT_BUCKET } from '@/lib/qoobix/storage';

type DownloadRouteProps = {
  params: Promise<{
    reportId: string;
  }>;
};

function contentTypeFor(fileType: string) {
  if (fileType === 'md') return 'text/markdown; charset=utf-8';
  if (fileType === 'csv') return 'text/csv; charset=utf-8';
  if (fileType === 'tsv') return 'text/tab-separated-values; charset=utf-8';
  if (fileType === 'rtf') return 'application/rtf';
  if (fileType === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (fileType === 'xlsx') {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  return 'application/octet-stream';
}

function safeAttachmentName(fileName: string) {
  return fileName.replace(/[\r\n"]/g, '').trim() || 'qoobix-report';
}

export async function GET(_request: NextRequest, { params }: DownloadRouteProps) {
  const { reportId } = await params;
  const sessionSlug = await getClientSessionSlug();

  if (!sessionSlug) {
    return NextResponse.json({ ok: false, error: 'Not authorised.' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient() as any;

  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('id, job_id, file_type, file_name, storage_path, file_url, expires_at')
    .eq('id', reportId)
    .single();

  if (reportError || !report) {
    return NextResponse.json({ ok: false, error: 'Report not found.' }, { status: 404 });
  }

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id, client_id, status')
    .eq('id', report.job_id)
    .single();

  if (jobError || !job) {
    return NextResponse.json({ ok: false, error: 'Job not found.' }, { status: 404 });
  }

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, slug, is_active')
    .eq('id', job.client_id)
    .single();

  if (clientError || !client || client.slug !== sessionSlug || !client.is_active) {
    return NextResponse.json({ ok: false, error: 'Not authorised.' }, { status: 403 });
  }

  if (!report.storage_path) {
    return NextResponse.redirect(report.file_url);
  }

  const { data: fileData, error: downloadError } = await supabase.storage
    .from(REPORT_BUCKET)
    .download(report.storage_path);

  if (downloadError || !fileData) {
    return NextResponse.json({ ok: false, error: 'Could not download report.' }, { status: 500 });
  }

  const fileName = safeAttachmentName(report.file_name);

  return new NextResponse(fileData, {
    headers: {
      'Content-Type': contentTypeFor(report.file_type),
      'Content-Disposition': `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      'Cache-Control': 'private, no-store, max-age=0'
    }
  });
}
