import { createClient } from '@supabase/supabase-js';
import { requireServerEnv } from '@/lib/config';
import type { Database } from '@/lib/supabase/types';

export function createSupabaseAdminClient() {
  return createClient<Database>(
    requireServerEnv('SUPABASE_URL'),
    requireServerEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}
