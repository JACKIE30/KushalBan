import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This is a simplified middleware - in a real app you'd check auth tokens
  // For now, we'll let the client-side components handle authentication
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ]
}