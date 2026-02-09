
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase project credentials
// You can find these in your Supabase Project Settings > API
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Check if we are using placeholders to avoid generic 'Failed to fetch' errors
export const isConfigured = 
  supabaseUrl !== 'https://your-project-url.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
