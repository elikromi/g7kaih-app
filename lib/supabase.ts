
import { createClient } from '@supabase/supabase-js';

// Ganti nilai di bawah ini dengan URL dan Anon Key dari Dashboard Supabase Anda
// Project Settings > API
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
