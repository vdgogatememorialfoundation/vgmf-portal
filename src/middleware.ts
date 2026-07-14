import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const redirectToLogin = (req: NextRequest) => {
  const url = new URL("/login", req.url);
  url.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(url);
};

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  const role = (session?.user as any)?.role as string | undefined;

  if (
    pathname === "/admin/login" ||
    pathname === "/staff/login" ||
    pathname === "/doctor/login" ||
    pathname === "/judge/login" ||
    pathname === "/trustee/login"
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!session || role !== "ADMIN") {
      return redirectToLogin(req);
    }
  }

  if (pathname.startsWith("/staff")) {
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return redirectToLogin(req);
    }
  }

  if (pathname.startsWith("/dashboard/reviewer")) {
    if (!session || (role !== "JUDGE" && role !== "REVIEWER")) {
      return redirectToLogin(req);
    }
  }

  if (pathname.startsWith("/dashboard/trustee")) {
    if (!session || role !== "TRUSTEE") {
      return redirectToLogin(req);
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return redirectToLogin(req);
    }
  }

  if (pathname.startsWith("/fellowship/apply")) {
    if (!session) {
      return redirectToLogin(req);
    }
  }

  if (pathname.startsWith("/fellowship/track")) {
    if (!session) {
      return redirectToLogin(req);
    }
  }

  if (pathname.startsWith("/seminar/register")) {
    if (!session) {
      return redirectToLogin(req);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/doctor/:path*",
    "/judge/:path*",
    "/trustee/:path*",
    "/dashboard/:path*",
    "/fellowship/apply/:path*",
    "/fellowship/track/:path*",
    "/seminar/register/:path*",
  ],
};
