/**
 * app/api/auth/register/route.ts
 * Реєстрація нового гравця через Supabase Auth
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { validate, RegisterSchema } from "@/lib/validations";
import { rateLimit, RATE_LIMITS, getClientIp } from "@/lib/rate-limit";
import { hashIp } from "@/lib/crypto";

const limiter = rateLimit({
  ...RATE_LIMITS.register,
  message: "Забагато спроб реєстрації. Спробуй через годину.",
});

export async function POST(req: NextRequest) {
  // ── Rate Limit ─────────────────────────────────────────────
  const ip = getClientIp(req);
  const ipHash = await hashIp(ip);
  const limited = await limiter(req, `register:${ipHash}`);
  if (limited) return limited;

  // ── Парсинг та валідація ───────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалідний JSON" }, { status: 400 });
  }

  const result = validate(RegisterSchema, body);
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const { nickname, email, password } = result.data;

  // ── Перевірка унікальності нікнейму ───────────────────────
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { errors: { nickname: ["Цей нікнейм вже зайнятий"] } },
      { status: 409 }
    );
  }

  // ── Створення користувача ──────────────────────────────────
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false, // відправить листа
    user_metadata: { nickname },
  });

  if (error) {
    // Не розкриваємо деталі помилки
    console.error("[register]", error.message);

    if (error.message.includes("already registered")) {
      return NextResponse.json(
        { errors: { email: ["Цей email вже зареєстровано"] } },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Помилка реєстрації. Спробуй пізніше." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Реєстрацію успішно завершено! Перевір пошту для підтвердження.",
      userId: data.user?.id,
    },
    { status: 201 }
  );
}
