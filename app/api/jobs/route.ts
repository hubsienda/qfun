import { NextRequest, NextResponse } from 'next/server';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { createJob } from '@/lib/qoobix/db';
import { newJobSchema } from '@/lib/qoobix/forms';

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const parsed = newJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid job request.' }, { status: 400 });
    }

    if (parsed.data.clientSlug !== sessionSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: 'This session cannot create jobs for that client.'
        },
        { status: 403 }
      );
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
