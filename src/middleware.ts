import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = (req.auth?.user as any)?.role;

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Staff routes
  if (pathname.startsWith("/staff")) {
    if (!req.auth || (role !== "ADMIN" && role !== "STAFF")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protected routes
  if (["/seminar/register", "/fellowship/apply", "/shop/checkout", "/profile"].some(p => pathname.startsWith(p))) {
    if (!req.auth) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/seminar/register", "/fellowship/apply", "/shop/checkout", "/profile"],
};
