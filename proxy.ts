import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const adminAuth = request.cookies.get("password")?.value;

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    if (adminAuth !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
