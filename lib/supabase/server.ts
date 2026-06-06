/**
 * lib/supabase/server.ts
 * Supabase клієнт для Server Components та API Routes
 * Використовує @supabase/ssr з cookie-based сесіями
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookies можна читати але не писати тут
          }
        },
      },
    }
  );
}

/**
 * Supabase клієнт із service_role ключем.
 * ТІЛЬКИ для server-side операцій що обходять RLS!
 * Ніколи не передавай цей клієнт на клієнт.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[supabase/server] NEXT_PUBLIC_SUPABASE_URL або SUPABASE_SERVICE_ROLE_KEY не налаштовано"
    );
  }

  return createServerClient<Database>(url, key, {
    cookies: { getAll: () => [], setAll: () => {} },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
