import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 예시: 로그인하지 않은 유저를 /login으로 리디렉션
  const token = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token')

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// 적용 경로 지정
export const config = {
  matcher: ['/dashboard/:path*'], // 필요 시 다른 경로로 수정 가능
}
