import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zzgobrlhnnqvspuwugkz.supabase.co';

const defaultAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Z29icmxobm5xdnNwdXd1Z2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNTM2ODcsImV4cCI6MjEwNjkyOTY4N30.OxHpl2ITfkYMnsxlX87D4ZCAZPgQxiL3KIoIeSKL1mE';

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  defaultAnonKey;

// Administrative client for server-side API operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
