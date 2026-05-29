import { env } from '@/lib/config';

export function isValidAdminPassword(password: string): boolean {
  if (!env.QOOBIX_ADMIN_PASSWORD) {
    return false;
  }

  return password === env.QOOBIX_ADMIN_PASSWORD;
}
