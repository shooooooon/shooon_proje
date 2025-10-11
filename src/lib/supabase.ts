import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser/server components (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for API routes and CLI (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export function getSupabaseClient() {
  return supabase;
}

export function getSupabaseAdminClient() {
  return supabaseAdmin;
}
