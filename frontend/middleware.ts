import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for admin pages (except login)
  if (pathname.startsWith('/admin') && !pathname.includes('/admin/login')) {
    // We can't check localStorage in middleware on the server
    // Instead, we'll handle this client-side with useEffect in admin pages
    // This middleware is just a placeholder for future authentication logic
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
