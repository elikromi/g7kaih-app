
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase project credentials
// You can find these in your Supabase Project Settings > API
const supabaseUrl = 'https://vletczmrxsyvwvsjxrnx.supabase.co';
const supabaseAnonKey = 'sb_publishable_NQnDZdRU4x464GHUAimWYA_VeJVWiyR';

// Check if we are using placeholders to avoid generic 'Failed to fetch' errors
export const isConfigured = 
  supabaseUrl !== 'https://vletczmrxsyvwvsjxrnx.supabase.co' && 
  supabaseAnonKey !== 'sb_publishable_NQnDZdRU4x464GHUAimWYA_VeJVWiyR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
