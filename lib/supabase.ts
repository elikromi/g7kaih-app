
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace these with your actual Supabase project credentials
// You can find these in your Supabase Project Settings > API
const supabaseUrl = 'https://vletczmrxsyvwvsjxrnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZXRjem1yeHN5dnd2c2p4cm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1OTk4MjgsImV4cCI6MjA4NjE3NTgyOH0.kpfMvqVICC55PPFDK6xz5EcndOaWFt91Mhr91nexrMY';

// Check if we are using placeholders to avoid generic 'Failed to fetch' errors
export const isConfigured = 
  supabaseUrl !== 'https://vletczmrxsyvwvsjxrnx.supabase.co' && 
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZXRjem1yeHN5dnd2c2p4cm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1OTk4MjgsImV4cCI6MjA4NjE3NTgyOH0.kpfMvqVICC55PPFDK6xz5EcndOaWFt91Mhr91nexrMY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
