import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page is always accessible
  if (pathname === "/admin/login") return NextResponse.next();

  const cookie = request.cookies.get("admin_session");
  if (!cookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Full HMAC verification happens in the admin layout (server component).
  // Middleware only handles the "no cookie at all" case for clean redirects.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
