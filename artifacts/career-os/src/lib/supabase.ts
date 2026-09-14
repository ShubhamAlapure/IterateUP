import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseUrl.startsWith('https://')
);

if (!isSupabaseConfigured) {
  console.info(
    '[IterateUP] Supabase is not yet configured or using placeholder credentials. Running in local state/sandbox mode. To connect real Supabase Auth, PostgreSQL, and Storage, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Fallback dummy credentials to prevent createClient crashes if env vars are unset
const clientUrl = isSupabaseConfigured ? supabaseUrl! : 'https://placeholder.supabase.co';
const clientKey = isSupabaseConfigured ? supabaseAnonKey! : 'placeholder-anon-key';

export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
