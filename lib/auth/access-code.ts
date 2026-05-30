import { createHash } from 'node:crypto';

export function normaliseAccessCode(value: string): string {
  return value.trim();
}

export function normaliseRecoveryPhrase(value: string): string {
  return value.trim();
}

export function hasNoSpaces(value: string): boolean {
  return !/\s/.test(value);
}

export function isAccessCodeFormatValid(value: string): boolean {
  const normalised = normaliseAccessCode(value);

  return (
    normalised.length >= 8 &&
    normalised.length <= 80 &&
    hasNoSpaces(normalised) &&
    /[a-z]/.test(normalised) &&
    /[A-Z]/.test(normalised) &&
    /[0-9]/.test(normalised)
  );
}

export function isRecoveryPhraseFormatValid(value: string): boolean {
  const normalised = normaliseRecoveryPhrase(value);

  return normalised.length >= 8 && normalised.length <= 80 && hasNoSpaces(normalised);
}

export function hashAccessCode(value: string): string {
  const normalised = normaliseAccessCode(value);

  return createHash('sha256').update(normalised).digest('hex');
}

export function hashRecoveryPhrase(value: string): string {
  const normalised = normaliseRecoveryPhrase(value);

  return createHash('sha256').update(normalised).digest('hex');
}
