import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// ─── Types ───────────────────────────────────────────────────────────────────

interface MCSrvStatResponse {
  online:   boolean
  players?: { online: number; max: number }
  version?: string
  motd?:    { clean?: string[] }
  software?: string
  hostname?: string
}

export interface ServerStatusPayload {
  online:   boolean
  players:  { online: number; max: number }
  version:  string | null
  motd:     string | null
  cachedAt: number
}

// ─── In-memory cache (survives between requests in same Node process) ─────────

const CACHE_TTL_MS = 30_000 // 30 секунд

let cachedPayload:   ServerStatusPayload | null = null
let cacheExpiresAt:  number = 0
let inflightPromise: Promise<ServerStatusPayload> | null = null

// ─── Rate-limit (per IP) ──────────────────────────────────────────────────────

const RATE_WINDOW_MS  = 10_000  // 10-секундне вікно
const RATE_MAX_HITS   = 5       // макс 5 запитів з одного IP за вікно

const ipHits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now  = Date.now()
  const slot = ipHits.get(ip)

  if (!slot || now > slot.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  slot.count++
  if (slot.count > RATE_MAX_HITS) return true
  return false
}

// Чистимо старі записи раз на 5 хвилин щоб не було memory leak
setInterval(() => {
  const now = Date.now()
  for (const [ip, slot] of ipHits) {
    if (now > slot.resetAt) ipHits.delete(ip)
  }
}, 5 * 60_000)

// ─── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchFromMcsrvstat(): Promise<ServerStatusPayload> {
  const apiKey = process.env.MCSRVSTAT_API_KEY // опціонально, якщо є

  const headers: Record<string, string> = {
    'User-Agent': 'SITAOWebsite/1.0',
    'Accept':     'application/json',
  }
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

  const res = await fetch('https://api.mcsrvstat.us/3/sitao.gomc.fun', {
    headers,
    // Не юзаємо next.revalidate тут — керуємо кешем вручну
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`mcsrvstat ${res.status}`)

  const data: MCSrvStatResponse = await res.json()

  return {
    online:   data.online   ?? false,
    players:  { online: data.players?.online ?? 0, max: data.players?.max ?? 0 },
    version:  data.version  ?? null,
    motd:     data.motd?.clean?.[0]  ?? null,
    cachedAt: Date.now(),
  }
}

// ─── Cache-aware getter (з request coalescing) ────────────────────────────────

async function getStatus(): Promise<ServerStatusPayload> {
  const now = Date.now()

  // Кеш свіжий — повертаємо одразу
  if (cachedPayload && now < cacheExpiresAt) return cachedPayload

  // Вже є inflight запит — чекаємо його замість нового (request coalescing)
  if (inflightPromise) return inflightPromise

  inflightPromise = fetchFromMcsrvstat()
    .then(payload => {
      cachedPayload  = payload
      cacheExpiresAt = Date.now() + CACHE_TTL_MS
      return payload
    })
    .catch(() => {
      // Якщо mcsrvstat впав — повертаємо stale або fallback
      return cachedPayload ?? {
        online: false,
        players: { online: 0, max: 0 },
        version: null,
        motd:    null,
        cachedAt: Date.now(),
      }
    })
    .finally(() => { inflightPromise = null })

  return inflightPromise
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  // IP для rate-limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(RATE_WINDOW_MS / 1000)) },
      }
    )
  }

  const payload = await getStatus()

  const age = Math.floor((Date.now() - payload.cachedAt) / 1000)

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': `public, s-maxage=${CACHE_TTL_MS / 1000}, stale-while-revalidate=60`,
      'X-Cache-Age':   String(age),
    },
  })
}
