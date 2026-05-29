export function normaliseAccessCode(value: string): string {
  return value.trim().replace(/\s+/g, '').toUpperCase();
}

export function isAccessCodeFormatValid(value: string): boolean {
  const normalised = normaliseAccessCode(value);

  return normalised.length >= 6 && normalised.length <= 80;
}
