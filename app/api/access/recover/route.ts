import { NextRequest, NextResponse } from 'next/server';
import { accessRecoverySchema } from '@/lib/qoobix/forms';
import { recoverClientAccessCode } from '@/lib/qoobix/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = accessRecoverySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid recovery data.'
        },
        { status: 400 }
      );
    }

    const recovered = await recoverClientAccessCode(parsed.data);

    return NextResponse.json({
      ok: true,
      clientSlug: recovered.clientSlug
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Access recovery failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
