import { NextRequest, NextResponse } from 'next/server';
import { isAccessCodeFormatValid, normaliseAccessCode } from '@/lib/auth/access-code';
import { getClientByAccessCode } from '@/lib/qoobix/db';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      code?: string;
    };

    const code = normaliseAccessCode(body.code ?? '');

    if (!isAccessCodeFormatValid(code)) {
      return NextResponse.json({ ok: false, error: 'Invalid access code.' }, { status: 400 });
    }

    const client = await getClientByAccessCode(code);

    if (!client) {
      return NextResponse.json({ ok: false, error: 'Access code not recognised.' }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      clientSlug: client.slug
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Access check failed.' }, { status: 500 });
  }
}
