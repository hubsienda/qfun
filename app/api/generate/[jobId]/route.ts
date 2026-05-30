import { NextRequest, NextResponse } from 'next/server';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { generateAndStoreJobOutputs } from '@/lib/qoobix/generation';
import { getJobWithClientAndReports } from '@/lib/qoobix/db';

type GenerateRouteProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: GenerateRouteProps) {
  try {
    const { jobId } = await params;
    const sessionSlug = await getClientSessionSlug();

    if (!sessionSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Client session required.'
        },
        { status: 401 }
      );
    }

    const data = await getJobWithClientAndReports(jobId);

    if (!data) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Job not found.'
        },
        { status: 404 }
      );
    }

    if (data.client.slug !== sessionSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: 'This session cannot generate outputs for that job.'
        },
        { status: 403 }
      );
    }

    await generateAndStoreJobOutputs(jobId);

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generation failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
