import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { issueTemporaryAccessCode } from '@/lib/qoobix/db';

type ResetAccessRouteProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: ResetAccessRouteProps) {
  try {
    const { clientId } = await params;
    const body = (await request.json()) as {
      adminPassword?: string;
    };

    if (!isValidAdminPassword(body.adminPassword ?? '')) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid admin password.'
        },
        { status: 401 }
      );
    }

    const reset = await issueTemporaryAccessCode(clientId);

    return NextResponse.json({
      ok: true,
      accessCode: reset.accessCode,
      clientName: reset.clientName,
      clientUrl: reset.clientUrl
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not issue temporary access code.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
