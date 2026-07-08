import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { env } from '@/lib/config';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

type StatusRouteProps = {
  params: Promise<{
    adminPath: string;
    clientId: string;
  }>;
};

async function setClientActiveStatus(input: { clientId: string; isActive: boolean }) {
  const supabase = createSupabaseAdminClient() as any;

  const { error } = await supabase
    .from('clients')
    .update({
      is_active: input.isActive
    })
    .eq('id', input.clientId);

  if (error) {
    throw new Error(error.message);
  }

  if (!input.isActive) {
    await supabase
      .from('access_codes')
      .update({
        is_active: false
      })
      .eq('client_id', input.clientId);
  }
}

export async function POST(request: NextRequest, { params }: StatusRouteProps) {
  const { adminPath, clientId } = await params;

  if (adminPath !== env.QOOBIX_ADMIN_PATH) {
    notFound();
  }

  try {
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
