import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { env } from '@/lib/config';
import { listAdminLogs } from '@/lib/qoobix/admin-logs';

type LogsListRouteProps = {
  params: Promise<{
    adminPath: string;
  }>;
};

export async function POST(request: NextRequest, { params }: LogsListRouteProps) {
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

    const logs = await listAdminLogs();

    return NextResponse.json({
      ok: true,
      logs
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load logs.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
