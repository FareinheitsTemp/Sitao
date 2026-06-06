/**
 * lib/crypto.ts
 * Утиліти шифрування для SITAO.fun
 *
 * Стек:
 *  - AES-256-GCM для шифрування даних (authenticated encryption)
 *  - bcryptjs для хешування паролів
 *  - Node.js crypto (Web Crypto у Edge Runtime)
 *
 * ВАЖЛИВО: ENCRYPTION_KEY повинен бути 64 hex-символів (32 байти / 256 біт).
 * Генерація: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import bcrypt from "bcryptjs";

// ─────────────────────────────────────────────────────────────
// Константи
// ─────────────────────────────────────────────────────────────
const BCRYPT_ROUNDS = 12; // 2^12 ітерацій — баланс безпека/швидкість
const GCM_IV_LENGTH = 12; // 96 біт — рекомендація NIST для AES-GCM
const GCM_TAG_LENGTH = 16; // 128 біт authentication tag
const ALGORITHM = "AES-GCM";

// ─────────────────────────────────────────────────────────────
// Завантаження ключа з оточення
// ─────────────────────────────────────────────────────────────
function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("[crypto] ENCRYPTION_KEY не знайдено в .env");
  }
  if (!/^[0-9a-f]{64}$/i.test(key)) {
    throw new Error("[crypto] ENCRYPTION_KEY має бути 64 hex-символів (32 байти)");
  }
  return key;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─────────────────────────────────────────────────────────────
// Завантаження CryptoKey (кешується після першого виклику)
// ─────────────────────────────────────────────────────────────
let _cachedCryptoKey: CryptoKey | null = null;

async function getCryptoKey(): Promise<CryptoKey> {
  if (_cachedCryptoKey) return _cachedCryptoKey;

  const rawKey = hexToBytes(getEncryptionKey());
  _cachedCryptoKey = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: ALGORITHM },
    false, // невитягуваний
    ["encrypt", "decrypt"]
  );
  return _cachedCryptoKey;
}

// ─────────────────────────────────────────────────────────────
// AES-256-GCM Шифрування
// ─────────────────────────────────────────────────────────────

/**
 * Шифрує довільний текст.
 * Повертає рядок формату: hex(iv):hex(tag):hex(ciphertext)
 */
export async function encrypt(plaintext: string): Promise<string> {
  if (!plaintext) throw new Error("[crypto] Порожній текст для шифрування");

  const key = await getCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(GCM_IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv, tagLength: GCM_TAG_LENGTH * 8 },
    key,
    encoded
  );

  // AES-GCM повертає: [ciphertext | tag] разом
  const ciphertextWithTag = new Uint8Array(encrypted);
  const ciphertext = ciphertextWithTag.slice(0, -GCM_TAG_LENGTH);
  const tag = ciphertextWithTag.slice(-GCM_TAG_LENGTH);

  return `${bytesToHex(iv)}:${bytesToHex(tag)}:${bytesToHex(ciphertext)}`;
}

/**
 * Дешифрує рядок формату hex(iv):hex(tag):hex(ciphertext)
 */
export async function decrypt(encryptedData: string): Promise<string> {
  if (!encryptedData) throw new Error("[crypto] Порожній шифртекст");

  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("[crypto] Невалідний формат шифртексту");
  }

  const [ivHex, tagHex, ciphertextHex] = parts;
  const iv = hexToBytes(ivHex);
  const tag = hexToBytes(tagHex);
  const ciphertext = hexToBytes(ciphertextHex);

  // AES-GCM очікує: [ciphertext | tag] разом
  const ciphertextWithTag = new Uint8Array(ciphertext.length + tag.length);
  ciphertextWithTag.set(ciphertext);
  ciphertextWithTag.set(tag, ciphertext.length);

  const key = await getCryptoKey();

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv, tagLength: GCM_TAG_LENGTH * 8 },
      key,
      ciphertextWithTag
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error("[crypto] Розшифрування невдале — дані пошкоджені або ключ неправильний");
  }
}

// ─────────────────────────────────────────────────────────────
// Bcrypt для паролів
// ─────────────────────────────────────────────────────────────

/**
 * Хешує пароль через bcrypt (12 раундів).
 * Supabase Auth вже хешує паролі — це для кастомних сценаріїв.
 */
export async function hashPassword(password: string): Promise<string> {
  if (password.length < 8) {
    throw new Error("[crypto] Пароль занадто короткий (мін. 8 символів)");
  }
  if (password.length > 72) {
    // bcrypt обрізає після 72 байт — попереджаємо
    throw new Error("[crypto] Пароль занадто довгий для bcrypt (макс. 72 символи)");
  }
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Перевіряє пароль проти bcrypt-хешу.
 * Використовує constant-time порівняння (bcrypt вбудований).
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!password || !hash) return false;
  try {
    return bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// Хешування не-паролів (для IP, user-agent тощо)
// ─────────────────────────────────────────────────────────────

/**
 * SHA-256 хеш із сіллю (HMAC-SHA256).
 * Для анонімізації IP у БД — не зворотний.
 */
export async function hmacHash(data: string): Promise<string> {
  const keyMaterial = hexToBytes(getEncryptionKey());
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return bytesToHex(new Uint8Array(signature));
}

/**
 * Хешує IP-адресу для зберігання у БД (необоротний).
 */
export async function hashIp(ip: string): Promise<string> {
  return hmacHash(`ip:${ip}`);
}

/**
 * Хешує user-agent для зберігання у БД.
 */
export async function hashUserAgent(ua: string): Promise<string> {
  return hmacHash(`ua:${ua}`);
}

// ─────────────────────────────────────────────────────────────
// Генерація токенів
// ─────────────────────────────────────────────────────────────

/**
 * Генерує криптографічно безпечний токен.
 * @param bytes — довжина у байтах (default 32 = 256 біт)
 */
export function generateToken(bytes: number = 32): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(bytes)));
}

/**
 * Constant-time рівняння рядків (проти timing attack).
 */
export function safeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }
  return result === 0;
}
