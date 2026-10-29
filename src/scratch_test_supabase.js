const fs = require('fs');
const envText = fs.readFileSync('.env.local', 'utf8');
const env = {};
envText.split(/\r?\n/).forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2 && !line.startsWith('#')) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    env[k] = v;
  }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('teachers_staff').select('code, education').eq('code', 'SYS_PROF').maybeSingle();
  console.log('error:', error);
  console.log('sys_prof exists:', !!data);
  if (data?.education) {
    const parsed = JSON.parse(data.education);
    console.log('keys in SYS_PROF:', Object.keys(parsed));
    console.log('profile:', JSON.stringify(parsed.profile, null, 2));
  }
}
run();
