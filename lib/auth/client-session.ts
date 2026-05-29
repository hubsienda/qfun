import { cookies } from 'next/headers';

const CLIENT_SESSION_COOKIE = 'qoobix_client_slug';

export async function setClientSession(clientSlug: string) {
  const cookieStore = await cookies();

  cookieStore.set(CLIENT_SESSION_COOKIE, clientSlug, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 8
  });
}

export async function getClientSessionSlug(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;

  return value ?? null;
}

export async function clearClientSession() {
  const cookieStore = await cookies();

  cookieStore.set(CLIENT_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 0
  });
}
