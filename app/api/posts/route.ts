/**
 * app/api/posts/route.ts
 * GET  — список опублікованих постів
 * POST — створення поста (тільки admin/owner)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validate, CreatePostSchema } from "@/lib/validations";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const limiter = rateLimit(RATE_LIMITS.api);

// ── GET /api/posts ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const limited = await limiter(req);
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit    = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const category = searchParams.get("category");
  const offset   = (page - 1) * limit;

  const supabase = await createClient();
  let query = supabase
    .from("v_published_posts")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1);

  // Валідація категорії
  const validCategories = ["news", "update", "event", "maintenance"];
  if (category && validCategories.includes(category)) {
    query = query.eq("category", category);
  }

  const { data: posts, error, count } = await query;

  if (error) {
    console.error("[posts GET]", error.message);
    return NextResponse.json({ error: "Помилка завантаження" }, { status: 500 });
  }

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  });
}

// ── POST /api/posts ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const limited = await limiter(req);
  if (limited) return limited;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  // Перевірка ролі
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "owner"].includes(profile.role)) {
    return NextResponse.json({ error: "Недостатньо прав" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Невалідний JSON" }, { status: 400 });
  }

  const result = validate(CreatePostSchema, body);
  if (!result.success) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const postData = {
    ...result.data,
    author_id: user.id,
    published_at: result.data.status === "published" ? new Date().toISOString() : null,
  };

  const { data: post, error } = await supabase
    .from("posts")
    .insert(postData)
    .select("id, title, slug, status")
    .single();

  if (error) {
    console.error("[posts POST]", error.message);
    if (error.message.includes("unique")) {
      return NextResponse.json(
        { errors: { slug: ["Цей slug вже зайнятий"] } },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Помилка створення посту" }, { status: 500 });
  }

  return NextResponse.json({ post }, { status: 201 });
}
