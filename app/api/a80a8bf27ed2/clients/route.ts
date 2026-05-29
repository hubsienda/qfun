import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminPassword } from '@/lib/auth/admin';
import { createClientWithAccessCode } from '@/lib/qoobix/db';
import { adminCreateClientSchema } from '@/lib/qoobix/forms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminCreateClientSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid client data.'
        },
        { status: 400 }
      );
    }

    if (!isValidAdminPassword(parsed.data.adminPassword)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Invalid admin password.'
        },
        { status: 401 }
      );
    }

    const created = await createClientWithAccessCode(parsed.data);

    return NextResponse.json({
      ok: true,
      client: {
        name: created.client.name,
        slug: created.client.slug
      },
      accessCode: created.accessCode,
      clientUrl: created.clientUrl
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Client creation failed.';

    return NextResponse.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
