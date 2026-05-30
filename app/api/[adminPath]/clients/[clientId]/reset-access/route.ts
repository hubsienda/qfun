import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { env } from '@/lib/config';
import { issueTemporaryAccessCode } from '@/lib/qoobix/db';

type ResetAccessRouteProps = {
  params: Promise<{
    adminPath: string;
    clientId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: ResetAccessRouteProps) {
  const { adminPath, clientId } = await params;

  if (adminPath !== env.QOOBIX_ADMIN_PATH) {
    notFound();
  }

  try {
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
