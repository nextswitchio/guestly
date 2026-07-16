import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/admin", "/organizer", "/vendor", "/attendee", "/influencer", "/influencer-dashboard"];

const publicRoutes = ["/", "/login", "/signup", "/register", "/events"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/organizer/:path*",
    "/vendor/:path*",
    "/attendee/:path*",
    "/influencer/:path*",
    "/influencer-dashboard/:path*",
  ],
};
