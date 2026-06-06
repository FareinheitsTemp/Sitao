/**
 * app/api/profile/route.ts
 * GET  — читання власного профілю
 * PATCH — оновлення профілю
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { validate, UpdateProfileSchema } from "@/lib/validations";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const limiter = rateLimit(RATE_LIMITS.heavy);

// ── GET /api/profile ───────────────────────────────────────────
export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "id, nickname, display_name, avatar_url, role, status, minecraft_name, play_time_hours, total_deaths, total_kills, balance, last_seen_at, created_at"
    )
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Профіль не знайдено" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

// ── PATCH /api/profile ─────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  // Rate limit
  const limited = await limiter(req);
  if (limited) return limited;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалідний JSON" }, { status: 400 });
  }

  const result = validate(UpdateProfileSchema, body);
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  // Фільтруємо undefined поля
  const updateData = Object.fromEntries(
    Object.entries(result.data).filter(([, v]) => v !== undefined && v !== "")
  );

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Нема полів для оновлення" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id)
    .select("id, nickname, display_name, avatar_url")
    .single();

  if (error) {
    console.error("[profile PATCH]", error.message);
    return NextResponse.json({ error: "Помилка оновлення профілю" }, { status: 500 });
  }

  return NextResponse.json({ profile: updated });
}
