import { z } from 'zod';

function splitList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const accessCodeSchema = z
  .string()
  .min(8, 'Access code must be at least 8 characters.')
  .max(80, 'Access code must be no more than 80 characters.')
  .refine((value) => !/\s/.test(value), 'Access code must not contain spaces.')
  .refine((value) => /[a-z]/.test(value), 'Access code must contain a lowercase letter.')
  .refine((value) => /[A-Z]/.test(value), 'Access code must contain an uppercase letter.')
  .refine((value) => /[0-9]/.test(value), 'Access code must contain a number.');

const recoveryPhraseSchema = z
  .string()
  .min(8, 'Recovery phrase must be at least 8 characters.')
  .max(80, 'Recovery phrase must be no more than 80 characters.')
  .refine((value) => !/\s/.test(value), 'Recovery phrase must not contain spaces.');

export const adminCreateClientSchema = z.object({
  adminPassword: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2).transform(slugify),
  preferredLanguage: z.string().optional().default('English'),
  availableReportTypes: z.string().optional().default('docx,xlsx').transform(splitList),
  fileRetentionDays: z.coerce.number().int().positive().default(30)
});

export const clientProfileSchema = z.object({
  clientSlug: z.string().min(2),
  sector: z.string().min(2),
  description: z.string().optional().default(''),
  website: z.string().optional().default(''),
  productsServices: z.string().optional().default(''),
  targetCountries: z.string().optional().default('').transform(splitList),
  targetCustomerTypes: z.string().optional().default('').transform(splitList),
  targetChannels: z.string().optional().default('').transform(splitList),
  knownCompetitors: z.string().optional().default(''),
  knownRepresentatives: z.string().optional().default(''),
  preferredLanguage: z.string().optional().default('English')
});

export const clientAccessCodeSchema = z
  .object({
    clientSlug: z.string().min(2),
    currentAccessCode: z.string().min(1),
    newAccessCode: accessCodeSchema,
    confirmAccessCode: accessCodeSchema,
    recoveryPhrase: recoveryPhraseSchema,
    confirmRecoveryPhrase: recoveryPhraseSchema
  })
  .refine((data) => data.newAccessCode === data.confirmAccessCode, {
    message: 'The new access codes do not match.',
    path: ['confirmAccessCode']
  })
  .refine((data) => data.recoveryPhrase === data.confirmRecoveryPhrase, {
    message: 'The recovery phrases do not match.',
    path: ['confirmRecoveryPhrase']
  });

export const accessRecoverySchema = z
  .object({
    clientSlug: z.string().min(2).transform(slugify),
    recoveryPhrase: recoveryPhraseSchema,
    newAccessCode: accessCodeSchema,
    confirmAccessCode: accessCodeSchema
  })
  .refine((data) => data.newAccessCode === data.confirmAccessCode, {
    message: 'The new access codes do not match.',
    path: ['confirmAccessCode']
  });

export const newJobSchema = z.object({
  clientId: z.string().uuid(),
  clientSlug: z.string().min(2),
  productOrService: z.string().min(2),
  targetCountries: z.string().min(2),
  marketQuestion: z.string().min(8),
  commercialObjective: z.string().min(2),
  targetCustomerTypes: z.string().optional().default(''),
  targetChannels: z.string().optional().default(''),
  knownCompetitors: z.string().optional().default(''),
  knownPartners: z.string().optional().default(''),
  preferredOutputLanguage: z.string().optional().default('English'),
  requiredOutputTypes: z.array(z.string()).default(['docx', 'xlsx'])
});

export type AdminCreateClientInput = z.infer<typeof adminCreateClientSchema>;
export type ClientProfileInput = z.infer<typeof clientProfileSchema>;
export type ClientAccessCodeInput = z.infer<typeof clientAccessCodeSchema>;
export type AccessRecoveryInput = z.infer<typeof accessRecoverySchema>;
export type NewJobInput = z.infer<typeof newJobSchema>;

export function createAccessCodeFromClientSlug(slug: string): string {
  const compactSlug = slug.replace(/-/g, '').slice(0, 10) || 'client';
  const randomPart = crypto.randomUUID().replace(/-/g, '').slice(0, 8);

  return `QbX-${compactSlug}-${randomPart}-Aa1`;
}
