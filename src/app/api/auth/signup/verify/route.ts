import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, name, phone, password } = await req.json();
    if (!email || !otp || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashed, role: "USER", emailVerified: new Date(), isActive: true },
    });
    return NextResponse.json({ success: true, userId: user.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
