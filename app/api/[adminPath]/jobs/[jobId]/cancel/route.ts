import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { env } from '@/lib/config';
import { cancelAdminJob } from '@/lib/qoobix/admin-jobs';

type CancelJobRouteProps = {
  params: Promise<{
    adminPath: string;
    jobId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: CancelJobRouteProps) {
  const { adminPath, jobId } = await params;

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

    await cancelAdminJob(jobId);

    return NextResponse.json({
      ok: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Job cancellation failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
