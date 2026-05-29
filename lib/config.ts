import { z } from 'zod';

const serverEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).default('gpt-5.4-mini'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  QOOBIX_ADMIN_PASSWORD: z.string().min(1).optional(),
  QOOBIX_FILE_RETENTION_DAYS: z.coerce.number().int().positive().default(30),
  QOOBIX_APP_URL: z.string().url().default('https://qoobix.com')
});

const parsedEnv = serverEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid QOOBIX environment configuration:', parsedEnv.error.flatten().fieldErrors);
}

export const env = parsedEnv.success
  ? parsedEnv.data
  : {
      OPENAI_API_KEY: undefined,
      OPENAI_MODEL: 'gpt-5.4-mini',
      SUPABASE_URL: undefined,
      SUPABASE_ANON_KEY: undefined,
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      QOOBIX_ADMIN_PASSWORD: undefined,
      QOOBIX_FILE_RETENTION_DAYS: 30,
      QOOBIX_APP_URL: 'https://qoobix.com'
    };

export function requireServerEnv(name: keyof typeof env): string {
  const value = env[name];

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
