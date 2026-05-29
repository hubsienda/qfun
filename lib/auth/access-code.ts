import { createHash } from 'node:crypto';

export function normaliseAccessCode(value: string): string {
  return value.trim().replace(/\s+/g, '').toUpperCase();
}

export function isAccessCodeFormatValid(value: string): boolean {
  const normalised = normaliseAccessCode(value);

  return normalised.length >= 8 && normalised.length <= 80;
}

export function hashAccessCode(value: string): string {
  const normalised = normaliseAccessCode(value);

  return createHash('sha256').update(normalised).digest('hex');
}
