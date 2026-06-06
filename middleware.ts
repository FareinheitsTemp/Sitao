import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/cabinet', '/settings']
const ADMIN_ROUTES     = ['/admin']
const AUTH_ROUTES      = ['/auth/login', '/auth/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Створюємо response і ОБОВ'ЯЗКОВО передаємо request щоб Supabase міг
  // оновити куки сесії (refresh token) і записати їх у відповідь
  let supabaseResponse = NextResponse.next({ request })

  // Security headers
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return supabaseResponse

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      // КРИТИЧНО: записуємо куки і в request і в response
      // щоб Server Components бачили оновлену сесію
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        // Переносимо security headers на новий response
        supabaseResponse.headers.set('X-Frame-Options', 'DENY')
        supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
        supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // КРИТИЧНО: використовувати getUser() а не getSession() —
  // getSession() не валідує токен на сервері
  let user = null
  try {
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u
  } catch {
    return supabaseResponse
  }

  // Редірект залогінених з auth сторінок
  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    if (user) {
      const redirectResponse = NextResponse.redirect(new URL('/cabinet', request.url))
      // Переносимо куки щоб сесія не загубилась при редіректі
      supabaseResponse.cookies.getAll().forEach(cookie =>
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      )
      return redirectResponse
    }
    return supabaseResponse
  }

  // Захист /cabinet і /settings
  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r))) {
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Захист /admin
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (!profile || !['admin', 'owner'].includes(profile.role)) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
