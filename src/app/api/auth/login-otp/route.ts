import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateOTP } from "@/lib/email";

const RESEND_COOLDOWN = 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { action, email, otp } = await req.json();

    if (action === "send-otp" || action === "resend-otp") {
      if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return NextResponse.json({ error: "No account found with this email" }, { status: 404 });

      if (!user.isActive) {
        return NextResponse.json({ error: "Your account has been deactivated. Please contact support." }, { status: 403 });
      }

      if (action === "resend-otp") {
        const lastSent = await prisma.otpRecord.findFirst({
          where: { email, action: "login" },
          orderBy: { sentAt: "desc" },
        });
        if (lastSent) {
          const elapsed = Date.now() - lastSent.sentAt.getTime();
          if (elapsed < RESEND_COOLDOWN) {
            const waitSeconds = Math.ceil((RESEND_COOLDOWN - elapsed) / 1000);
            return NextResponse.json({ error: `Please wait ${waitSeconds} seconds before resending` }, { status: 429 });
          }
        }
      }

      const code = generateOTP();
      const now = new Date();
      const expires = new Date(now.getTime() + 10 * 60 * 1000);

      await prisma.otpRecord.deleteMany({ where: { email, action: "login" } });
      await prisma.otpRecord.create({
        data: { email, code, action: "login", expires, sentAt: now },
      });

      await sendEmail({
        to: [{ email, name: user.name || email }],
        subject: "Your VGMF Login Code",
        htmlBody: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
          <h2 style="color:#0d6662">VGMF Login Verification</h2>
          <p>Hi ${user.name || "there"},</p>
          <p>Your login verification code is:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#0d6662;background:#f0fdfa;padding:15px;text-align:center;border-radius:8px;margin:20px 0">${code}</div>
          <p style="color:#666;font-size:14px">This code expires in 10 minutes.</p>
          <p style="color:#666;font-size:14px">If you didn't request this, please ignore this email and consider changing your password.</p>
        </div>`,
      });

      return NextResponse.json({ success: true, message: "OTP sent to your email", resendAfter: now.getTime() + RESEND_COOLDOWN });
    }

    if (action === "verify-otp") {
      if (!email || !otp) {
        return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
      }

      const record = await prisma.otpRecord.findFirst({
        where: { email, action: "login", verified: false },
        orderBy: { sentAt: "desc" },
      });

      if (!record || record.code !== otp || new Date() > record.expires) {
        return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
      }

      await prisma.otpRecord.update({
        where: { id: record.id },
        data: { verified: true },
      });

      return NextResponse.json({ success: true, message: "OTP verified. You can now sign in." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
