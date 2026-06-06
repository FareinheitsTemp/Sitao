/**
 * scripts/generate-key.mjs
 * Скрипт генерації ENCRYPTION_KEY для .env.local
 *
 * Запуск: node scripts/generate-key.mjs
 */

import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_FILE = join(ROOT, ".env.local");

// Генеруємо 32 байти (256 біт) = 64 hex символи
const key = randomBytes(32).toString("hex");

console.log("╔══════════════════════════════════════════════════╗");
console.log("║     SITAO.fun — Генератор ключа шифрування       ║");
console.log("╚══════════════════════════════════════════════════╝");
console.log();
console.log("🔐 Ваш ENCRYPTION_KEY (AES-256):");
console.log();
console.log(`   ENCRYPTION_KEY=${key}`);
console.log();

// Спробувати додати до .env.local
if (existsSync(ENV_FILE)) {
  let envContent = readFileSync(ENV_FILE, "utf-8");

  if (envContent.includes("ENCRYPTION_KEY=")) {
    console.log("⚠️  ENCRYPTION_KEY вже є у .env.local — не перезаписуємо.");
    console.log("   Скопіюй ключ вище та встав вручну якщо потрібно.");
  } else {
    envContent += `\n# Ключ шифрування AES-256-GCM (32 байти / 256 біт)\nENCRYPTION_KEY=${key}\n`;
    writeFileSync(ENV_FILE, envContent);
    console.log("✅ ENCRYPTION_KEY додано до .env.local");
  }
} else {
  console.log("⚠️  Файл .env.local не знайдено.");
  console.log("   Скопіюй рядок вище та додай у .env.local вручну.");
}

console.log();
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("⚠️  ВАЖЛИВО:");
console.log("   • Ніколи не публікуй цей ключ у git");
console.log("   • Зроби резервну копію ключа у безпечному місці");
console.log("   • Зміна ключа = всі зашифровані дані стануть недоступні");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
