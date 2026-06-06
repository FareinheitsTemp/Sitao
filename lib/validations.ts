/**
 * lib/validations.ts
 * Zod схеми валідації для всіх API-ендпоінтів
 * Захист від SQL-injection, XSS та поганих запитів
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// Базові санітизатори
// ─────────────────────────────────────────────────────────────

/** Видаляє HTML-теги та небезпечні символи */
function sanitizeText(str: string): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, "") // Strip HTML
    .replace(/[<>'"]/g, ""); // Strip XSS chars
}

const sanitized = (schema: z.ZodString) =>
  schema.transform(sanitizeText);

// ─────────────────────────────────────────────────────────────
// Auth схеми
// ─────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  nickname: z
    .string()
    .min(3, "Нікнейм мінімум 3 символи")
    .max(16, "Нікнейм максимум 16 символів")
    .regex(/^[a-zA-Z0-9_]+$/, "Тільки латиниця, цифри та _"),

  email: z
    .string()
    .email("Невалідний email")
    .max(254, "Email занадто довгий")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, "Мінімум 8 символів")
    .max(72, "Максимум 72 символи")
    .regex(/[A-Z]/, "Потрібна хоча б одна велика літера")
    .regex(/[0-9]/, "Потрібна хоча б одна цифра"),
});

export const LoginSchema = z.object({
  login: z.string().min(1).max(254).trim(),
  password: z.string().min(1).max(72),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(72),
    newPassword: z
      .string()
      .min(8, "Мінімум 8 символів")
      .max(72, "Максимум 72 символи")
      .regex(/[A-Z]/, "Потрібна велика літера")
      .regex(/[0-9]/, "Потрібна цифра"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

// ─────────────────────────────────────────────────────────────
// Profile схеми
// ─────────────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  display_name: sanitized(
    z.string().min(1).max(32, "Максимум 32 символи").optional().or(z.literal(""))
  ),
  avatar_url: z
    .string()
    .url("Невалідне URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  minecraft_name: z
    .string()
    .regex(/^[a-zA-Z0-9_]{1,16}$/, "Невалідний Minecraft нікнейм")
    .optional()
    .or(z.literal("")),
});

// ─────────────────────────────────────────────────────────────
// Posts схеми
// ─────────────────────────────────────────────────────────────

export const CreatePostSchema = z.object({
  title: sanitized(z.string().min(3).max(200)),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug: тільки малі літери, цифри та дефіс"),
  content: z.string().min(10).max(524288), // 512KB
  excerpt: sanitized(z.string().max(500).optional().or(z.literal(""))),
  cover_url: z.string().url().max(500).optional().or(z.literal("")),
  category: z.enum(["news", "update", "event", "maintenance"]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  pinned: z.boolean().default(false),
});

// ─────────────────────────────────────────────────────────────
// Comments схеми
// ─────────────────────────────────────────────────────────────

export const CreateCommentSchema = z.object({
  post_id: z.string().uuid("Невалідний ID посту"),
  content: sanitized(z.string().min(1, "Коментар порожній").max(2000, "Максимум 2000 символів")),
  parent_id: z.string().uuid().optional().nullable(),
});

// ─────────────────────────────────────────────────────────────
// Reports схеми
// ─────────────────────────────────────────────────────────────

export const CreateReportSchema = z.object({
  target_id: z.string().uuid("Невалідний ID гравця"),
  reason: sanitized(
    z.string().min(10, "Мінімум 10 символів").max(1000, "Максимум 1000 символів")
  ),
  evidence_urls: z
    .array(z.string().url("Невалідне посилання"))
    .max(5, "Максимум 5 посилань")
    .default([]),
});

// ─────────────────────────────────────────────────────────────
// Утиліти валідації
// ─────────────────────────────────────────────────────────────

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string[]> = {};
  result.error.issues.forEach((issue) => {
    const key = issue.path.join(".") || "general";
    if (!errors[key]) errors[key] = [];
    errors[key].push(issue.message);
  });

  return { success: false, errors };
}
