import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHmac } from "crypto";

const JWT_SECRET = process.env.AUTH_SECRET || "vgmf-secret";

function signToken(payload: Record<string, unknown>, expiresIn: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const expSeconds = parseInt(expiresIn) * 60;
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + expSeconds })
  ).toString("base64url");
  const signature = createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, targetPortal } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const token = signToken(
      { userId: user.id, email: user.email, role: user.role, portal: targetPortal },
      "5"
    );

    const portalUrls: Record<string, string> = {
      seminar: "https://seminar.vaidyagogate.org/sso/verify",
      fellowship: "https://fellowship.vaidyagogate.org/sso/verify",
      autism: "https://autism.vaidyagogate.org/sso/verify",
    };

    const ssoUrl = `${portalUrls[targetPortal]}?token=${token}`;

    return NextResponse.json({ ssoUrl, token });
  } catch {
    return NextResponse.json({ error: "SSO failed" }, { status: 500 });
  }
}
