import { NextRequest, NextResponse } from 'next/server';
import { generateAndStoreJobOutputs } from '@/lib/qoobix/generation';

type GenerateRouteProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function POST(_request: NextRequest, { params }: GenerateRouteProps) {
  try {
    const { jobId } = await params;
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
