import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  try {
    // Check endorser authentication status
    const endorserResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/endorsers/me`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    })

    const isEndorserAuthenticated = endorserResponse.ok
    const endorserData = isEndorserAuthenticated ? await endorserResponse.json() : null

    // If user is an authenticated endorser
    if (isEndorserAuthenticated && endorserData.user) {
      // Endorsers should only access dashboard routes, redirect from anywhere else
      // This includes the root path '/'
      if (pathname === '/' || !pathname.startsWith('/endorser/dashboard/')) {
        return NextResponse.redirect(new URL('/endorser/dashboard/insights', request.url))
      }
      return NextResponse.next()
    }

    // For non-endorser users (or not authenticated)
    if (pathname.startsWith('/endorser/dashboard/')) {
      // Redirect to login if trying to access dashboard
      const loginUrl = new URL('/endorser/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Allow access to endorser login page only if not authenticated
    if (pathname === '/endorser/login') {
      if (isEndorserAuthenticated && endorserData.user) {
        return NextResponse.redirect(new URL('/endorser/dashboard/insights', request.url))
      }
      return NextResponse.next()
    }

    // For all other endorser routes that aren't dashboard or login
    if (pathname.startsWith('/endorser/') && !pathname.startsWith('/endorser/verifyemail')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware auth check failed:', error)
    // For security, redirect to home page on error
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/', '/endorser/:path*'],
}
