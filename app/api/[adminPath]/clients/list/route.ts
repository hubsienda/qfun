import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { env } from '@/lib/config';
import { listAdminClients } from '@/lib/qoobix/db';

type AdminRouteProps = {
  params: Promise<{
    adminPath: string;
  }>;
};

export async function POST(request: NextRequest, { params }: AdminRouteProps) {
  const { adminPath } = await params;

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

    const clients = await listAdminClients();

    return NextResponse.json({
      ok: true,
      clients
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load clients.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
