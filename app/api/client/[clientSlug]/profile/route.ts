import { NextRequest, NextResponse } from 'next/server';
import { getClientSessionSlug } from '@/lib/auth/client-session';
import { clientProfileSchema } from '@/lib/qoobix/forms';
import { updateClientProfile } from '@/lib/qoobix/db';

type ClientProfileRouteProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export async function POST(request: NextRequest, { params }: ClientProfileRouteProps) {
  try {
    const { clientSlug } = await params;
    const sessionSlug = await getClientSessionSlug();

    if (sessionSlug !== clientSlug) {
      return NextResponse.json(
        {
          ok: false,
          error: 'This session cannot update that client profile.'
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const parsed = clientProfileSchema.safeParse({
      ...body,
      clientSlug
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid business profile data.'
        },
        { status: 400 }
      );
    }

    await updateClientProfile(parsed.data);

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Profile update failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
