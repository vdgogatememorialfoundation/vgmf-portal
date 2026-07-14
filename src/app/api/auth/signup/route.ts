import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateOTP } from "@/lib/email";
import bcrypt from "bcryptjs";

const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(req: NextRequest) {
  try {
    const { action, email, name, phone, password, otp } = await req.json();

    if (action === "send-otp") {
      if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

      const code = generateOTP();
      otpStore.set(email, { otp: code, expires: Date.now() + 10 * 60 * 1000 });

      await sendEmail({
        to: [{ email, name: name || email }],
        subject: "Your VGMF Verification Code",
        htmlBody: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
          <h2 style="color:#0f1f4a">VGMF Account Verification</h2>
          <p>Your verification code is:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#0f1f4a;background:#f0f7ff;padding:15px;text-align:center;border-radius:8px;margin:20px 0">${code}</div>
          <p style="color:#666;font-size:14px">This code expires in 10 minutes.</p>
          <p style="color:#666;font-size:14px">If you didn't request this, please ignore this email.</p>
        </div>`,
      });

      return NextResponse.json({ success: true, message: "OTP sent to your email" });
    }

    if (action === "verify") {
      if (!email || !password || password.length < 6) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

      const stored = otpStore.get(email);
      if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
        return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

      const hashed = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { name, email, phone, password: hashed, role: "USER", emailVerified: new Date() },
      });

      await sendEmail({
        to: [{ email, name: name || email }],
        subject: "Welcome to VGMF Portal",
        htmlBody: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
          <h2 style="color:#0f1f4a">Welcome to VGMF, ${name || "User"}!</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now register for seminars, apply for fellowships, and access our programmes.</p>
          <a href="${process.env.NEXTAUTH_URL || "https://staging.vaidyagogate.org"}/login" style="display:inline-block;padding:12px 24px;background:#0f1f4a;color:white;border-radius:8px;text-decoration:none;margin-top:16px">Sign In</a>
        </div>`,
      });

      otpStore.delete(email);
      return NextResponse.json({ success: true, userId: user.id });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
