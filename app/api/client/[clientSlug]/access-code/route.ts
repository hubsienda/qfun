import { NextRequest, NextResponse } from 'next/server';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { clientAccessCodeSchema } from '@/lib/qoobix/forms';
import { rotateClientAccessCode } from '@/lib/qoobix/db';

type ClientAccessCodeRouteProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export async function POST(request: NextRequest, { params }: ClientAccessCodeRouteProps) {
  try {
    const { clientSlug } = await params;
    const sessionSlug = await getClientSessionSlug();

    if (sessionSlug !== clientSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: 'This session cannot rotate that client access code.'
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const parsed = clientAccessCodeSchema.safeParse({
      ...body,
      clientSlug
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid access code or recovery phrase data.'
        },
        { status: 400 }
      );
    }

    const rotated = await rotateClientAccessCode(parsed.data);

    return NextResponse.json({
      ok: true,
      accessCode: rotated.accessCode
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Access code rotation failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
