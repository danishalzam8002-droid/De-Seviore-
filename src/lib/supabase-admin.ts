import { createClient } from "@supabase/supabase-js";

// Klien ini memiliki akses penuh (Admin) untuk melewati RLS 
// dan melakukan operasi administratif seperti membuat user.
// HANYA digunakan di sisi server (API Routes).
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', 
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
  , {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
