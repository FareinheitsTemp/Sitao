/**
 * app/api/auth/logout/route.ts
 * Вихід із системи
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.json({ message: "Вийшли успішно" });
}
