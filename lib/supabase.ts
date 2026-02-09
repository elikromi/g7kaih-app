
import { createClient } from '@supabase/supabase-js';

// Ganti nilai di bawah ini dengan URL dan Anon Key dari Dashboard Supabase Anda
// Project Settings > API
const supabaseUrl = 'https://vletczmrxsyvwvsjxrnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZXRjem1yeHN5dnd2c2p4cm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1OTk4MjgsImV4cCI6MjA4NjE3NTgyOH0.kpfMvqVICC55PPFDK6xz5EcndOaWFt91Mhr91nexrMY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
