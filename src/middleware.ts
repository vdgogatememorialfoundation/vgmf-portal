import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  const role = (session?.user as any)?.role;

  if (pathname.startsWith("/admin")) {
    if (!session || role !== "ADMIN") {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/staff")) {
    if (!session || (role !== "ADMIN" && role !== "STAFF")) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};
