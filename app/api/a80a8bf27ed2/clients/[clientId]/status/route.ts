import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { setClientActiveStatus } from '@/lib/qoobix/db';

type StatusRouteProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: StatusRouteProps) {
  try {
    const { clientId } = await params;
    const body = (await request.json()) as {
      adminPassword?: string;
      isActive?: boolean;
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

    if (typeof body.isActive !== 'boolean') {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid status.'
        },
        { status: 400 }
      );
    }

    await setClientActiveStatus({
      clientId,
      isActive: body.isActive
    });

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update client status.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
