import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error('Missing Supabase admin environment variables:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
    });
    throw new Error('Supabase environment variables are not set');
  }

  _supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
      }
    }
  });

  return _supabaseAdmin;
} 