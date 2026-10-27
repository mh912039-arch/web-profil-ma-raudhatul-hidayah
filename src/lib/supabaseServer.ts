import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zzgobrlhnnqvspuwugkz.supabase.co';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Z29icmxobm5xdnNwdXd1Z2t6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM1MzY4NywiZXhwIjoyMTA2OTI5Njg3fQ.s9M2c-_EIg0dbqTCPHU7p87ALePVXXtFtawjASxWzXo';

// Service role client bypasses RLS for administrative backend operations
export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
