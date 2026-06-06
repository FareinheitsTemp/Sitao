/**
 * lib/rate-limit.ts
 * Rate limiting middleware для API Routes
 * In-memory (dev) + DB-рівень (prod via Supabase function)
 */

import { NextRequest, NextResponse } from "next/server";
import { hashIp } from "@/lib/crypto";

// ─────────────────────────────────────────────────────────────
// In-memory rate limiter (для dev та як перший рівень захисту)
// ─────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Очищення застарілих записів кожні 5 хвилин
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Кількість запитів у вікні */
  limit: number;
  /** Вікно у мілісекундах */
  windowMs: number;
  /** Текст помилки */
  message?: string;
}

// Набір конфігурацій для різних ендпоінтів
export const RATE_LIMITS = {
  auth: { limit: 5, windowMs: 5 * 60 * 1000 },         // 5 спроб / 5 хв
  register: { limit: 3, windowMs: 60 * 60 * 1000 },     // 3 реєстрації / год
  api: { limit: 60, windowMs: 60 * 1000 },              // 60 запитів / хв
  heavy: { limit: 10, windowMs: 60 * 1000 },            // 10 / хв (тяжкі операції)
} as const;

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(
    req: NextRequest,
    identifier?: string
  ): Promise<NextResponse | null> {
    const ip = getClientIp(req);
    const key = identifier
      ? `rl:${identifier}`
      : `rl:${await hashIp(ip)}`;

    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + config.windowMs });
      return null; // Дозволено
    }

    if (entry.count >= config.limit) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return NextResponse.json(
        {
          error: config.message || "Забагато запитів. Спробуй пізніше.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(config.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
          },
        }
      );
    }

    entry.count++;
    return null; // Дозволено
  };
}

/** Отримує реальний IP клієнта (з врахуванням проксі) */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // Перший IP у ланцюжку — реальний клієнт
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}
