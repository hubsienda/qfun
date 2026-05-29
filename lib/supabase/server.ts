import { createClient } from '@supabase/supabase-js';
import { requireServerEnv } from '@/lib/config';
import type { Database } from '@/lib/supabase/types';

export function createSupabaseAnonClient() {
  return createClient<Database>(
    requireServerEnv('SUPABASE_URL'),
    requireServerEnv('SUPABASE_ANON_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}
