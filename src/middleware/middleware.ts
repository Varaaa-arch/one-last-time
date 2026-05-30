import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const verified = request.cookies.get("verified")?.value

  if (!verified || verified !== "true") {
    return NextResponse.redirect(new URL("/password", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/letter/:path*"],
}