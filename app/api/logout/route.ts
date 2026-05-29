import { NextResponse } from 'next/server';
import { clearClientSession } from '@/lib/auth/client-session';

export async function POST() {
  await clearClientSession();

  return NextResponse.json({
    ok: true
  });
}
