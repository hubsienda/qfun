import { NextRequest, NextResponse } from 'next/server';
import { clientAccessCodeSchema } from '@/lib/qoobix/forms';
import { updateClientAccessCode } from '@/lib/qoobix/db';

type ClientAccessCodeRouteProps = {
  params: Promise<{
    clientSlug: string;
  }>;
};

export async function POST(request: NextRequest, { params }: ClientAccessCodeRouteProps) {
  try {
    const { clientSlug } = await params;
    const body = await request.json();

    const parsed = clientAccessCodeSchema.safeParse({
      ...body,
      clientSlug
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid access code data.'
        },
        { status: 400 }
      );
    }

    await updateClientAccessCode(parsed.data);

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Access code update failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
