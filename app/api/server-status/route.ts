import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface MCSrvStatPlayers {
  online: number
  max: number
}

interface MCSrvStatResponse {
  online: boolean
  players?: MCSrvStatPlayers
  motd?: { clean?: string[] }
  version?: string
  ip?: string
  port?: number
}

export interface ServerStatusPayload {
  online: boolean
  players: { online: number; max: number }
  version: string | null
  cachedAt: number
}

export async function GET(): Promise<NextResponse<ServerStatusPayload>> {
  try {
    const res = await fetch('https://api.mcsrvstat.us/3/sitao.fun', {
      next: { revalidate: 30 },
      headers: { 'User-Agent': 'SITAOWebsite/1.0' },
    })

    if (!res.ok) throw new Error(`mcsrvstat returned ${res.status}`)

    const data: MCSrvStatResponse = await res.json()

    return NextResponse.json(
      {
        online: data.online ?? false,
        players: {
          online: data.players?.online ?? 0,
          max:    data.players?.max    ?? 0,
        },
        version:  data.version ?? null,
        cachedAt: Date.now(),
      },
      {
        headers: {
          'Cache-Control': 's-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch {
    return NextResponse.json(
      { online: false, players: { online: 0, max: 0 }, version: null, cachedAt: Date.now() },
      { status: 200 }
    )
  }
}
