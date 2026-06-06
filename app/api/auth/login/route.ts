/**
 * app/api/auth/login/route.ts
 * Вхід через Supabase Auth із rate limiting
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validate, LoginSchema } from "@/lib/validations";
import { rateLimit, RATE_LIMITS, getClientIp } from "@/lib/rate-limit";
import { hashIp, hashUserAgent } from "@/lib/crypto";

const limiter = rateLimit({
  ...RATE_LIMITS.auth,
  message: "Забагато спроб входу. Спробуй через 5 хвилин.",
});

export async function POST(req: NextRequest) {
  // ── Rate Limit ─────────────────────────────────────────────
  const ip = getClientIp(req);
  const ipHash = await hashIp(ip);
  const limited = await limiter(req, `login:${ipHash}`);
  if (limited) return limited;

  // ── Парсинг та валідація ───────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалідний JSON" }, { status: 400 });
  }

  const result = validate(LoginSchema, body);
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const { login, password } = result.data;

  // Визначаємо чи це email чи нікнейм
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login);
  let email = isEmail ? login : null;

  const supabase = await createClient();

  // Якщо нікнейм — знаходимо email
  if (!isEmail) {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const serviceClient = createServiceClient();
    const { data: profile } = await serviceClient
      .from("profiles")
      .select("id")
      .eq("nickname", login)
      .maybeSingle();

    if (!profile) {
      // Не розкриваємо що саме невірне
      return NextResponse.json(
        { error: "Невірний логін або пароль" },
        { status: 401 }
      );
    }

    const { data: { user } } = await serviceClient.auth.admin.getUserById(profile.id);
    email = user?.email ?? null;
  }

  if (!email) {
    return NextResponse.json(
      { error: "Невірний логін або пароль" },
      { status: 401 }
    );
  }

  // ── Авторизація ────────────────────────────────────────────
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: "Невірний логін або пароль" },
      { status: 401 }
    );
  }

  // ── Перевірка статусу (бан) ────────────────────────────────
  const { createServiceClient } = await import("@/lib/supabase/server");
  const serviceClient = createServiceClient();
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("status, role")
    .eq("id", data.user.id)
    .single();

  if (profile?.status === "banned") {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Ваш акаунт заблоковано. Зверніться до адміністрації." },
      { status: 403 }
    );
  }

  // ── Запис сесії для аудиту ────────────────────────────────
  const ua = req.headers.get("user-agent") || "";
  const uaHash = await hashUserAgent(ua);

  await serviceClient.from("login_sessions").insert({
    user_id: data.user.id,
    ip_hash: ipHash,
    user_agent_hash: uaHash,
  });

  return NextResponse.json({
    message: "Успішно авторизовано",
    user: {
      id: data.user.id,
      email: data.user.email,
      role: profile?.role,
    },
  });
}
