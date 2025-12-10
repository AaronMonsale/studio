import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/admin', '/staff', '/kitchen']
const PUBLIC_ROUTES = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('swiftpos-session')

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (sessionCookie && isPublicRoute) {
    try {
      const session = JSON.parse(sessionCookie.value)
      const { userType } = session
      
      let redirectUrl = '/login'
      if (userType === 'admin') {
        redirectUrl = '/admin/dashboard'
      } else if (userType === 'staff') {
        redirectUrl = '/staff'
      } else if (userType === 'kitchen') {
        redirectUrl = '/kitchen'
      }
      
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (error) {
      // Invalid cookie, clear it and proceed to public route
      const response = NextResponse.next();
      response.cookies.delete('swiftpos-session');
      return response;
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
