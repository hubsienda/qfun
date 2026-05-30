import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { env } from '@/lib/config';
import { cleanupExpiredReports } from '@/lib/qoobix/cleanup';

type CleanupRouteProps = {
  params: Promise<{
    adminPath: string;
  }>;
};

export async function POST(request: NextRequest, { params }: CleanupRouteProps) {
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

    const result = await cleanupExpiredReports();

    return NextResponse.json({
      ok: true,
      result
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cleanup failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
