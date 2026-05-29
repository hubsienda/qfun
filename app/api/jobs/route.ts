import { NextRequest, NextResponse } from 'next/server';
import { createJob } from '@/lib/qoobix/db';
import { newJobSchema } from '@/lib/qoobix/forms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid job request.' }, { status: 400 });
    }

    const job = await createJob(parsed.data);

    return NextResponse.json({
      ok: true,
      jobId: job.id
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Job creation failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
