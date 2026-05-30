import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { listAdminClients } from '@/lib/qoobix/db';

export async function POST(request: NextRequest) {
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
