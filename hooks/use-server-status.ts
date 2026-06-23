import { useState, useEffect, useCallback } from 'react'
import type { ServerStatusPayload } from '@/app/api/server-status/route'

interface UseServerStatusOptions {
  /** Polling interval in ms. Default: 30_000 (30s) */
  interval?: number
  /** Fetch immediately on mount. Default: true */
  immediate?: boolean
}

interface UseServerStatusReturn {
  data:    ServerStatusPayload | null
  loading: boolean
  error:   string | null
  refetch: () => void
}

export function useServerStatus({
  interval = 30_000,
  immediate = true,
}: UseServerStatusOptions = {}): UseServerStatusReturn {
  const [data,    setData]    = useState<ServerStatusPayload | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/server-status')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: ServerStatusPayload = await res.json()
      setData(json)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (immediate) fetchStatus()
    const id = setInterval(fetchStatus, interval)
    return () => clearInterval(id)
  }, [fetchStatus, immediate, interval])

  return { data, loading, error, refetch: fetchStatus }
}
