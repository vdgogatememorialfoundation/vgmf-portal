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

  // Admin / Staff login pages → public (anyone can view)
  if (pathname === "/admin/login" || pathname === "/staff/login") {
    return NextResponse.next();
  }

  // Admin routes → ADMIN only
  if (pathname.startsWith("/admin")) {
    if (!session || role !== "ADMIN") {
      return redirectToLogin(req);
    }
  }

  // Staff routes → ADMIN or STAFF
  if (pathname.startsWith("/staff")) {
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      return redirectToLogin(req);
    }
  }

  // Reviewer dashboard → JUDGE or REVIEWER
  if (pathname.startsWith("/dashboard/reviewer")) {
    if (!session || (role !== "JUDGE" && role !== "REVIEWER")) {
      return redirectToLogin(req);
    }
  }

  // Trustee dashboard → TRUSTEE only
  if (pathname.startsWith("/dashboard/trustee")) {
    if (!session || role !== "TRUSTEE") {
      return redirectToLogin(req);
    }
  }

  // Dashboard → any authenticated user
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return redirectToLogin(req);
    }
  }

  // Fellowship apply → any authenticated user
  if (pathname.startsWith("/fellowship/apply")) {
    if (!session) {
      return redirectToLogin(req);
    }
  }

  // Fellowship track → any authenticated user
  if (pathname.startsWith("/fellowship/track")) {
    if (!session) {
      return redirectToLogin(req);
    }
  }

  // Seminar register → DOCTOR or any authenticated user
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
    "/dashboard/:path*",
    "/fellowship/apply/:path*",
    "/fellowship/track/:path*",
    "/seminar/register/:path*",
  ],
};
