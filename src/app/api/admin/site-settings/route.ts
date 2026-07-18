import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { clearSettingsCache } from "@/lib/settings";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = [
  { key: "auth.allowSignup", value: "true", description: "Allow new user signups", group: "auth" },
  { key: "auth.allowLogin", value: "true", description: "Allow user login", group: "auth" },
  { key: "auth.loginMethod", value: "password", description: "Login method: password, otp, or both", group: "auth" },
  { key: "payment.razorpayKeyId", value: "", description: "Razorpay Live Key ID", group: "payment" },
  { key: "payment.razorpayKeySecret", value: "", description: "Razorpay Live Key Secret", group: "payment" },
  { key: "payment.razorpayTestKeyId", value: "", description: "Razorpay Test Key ID", group: "payment" },
  { key: "payment.razorpayTestSecret", value: "", description: "Razorpay Test Key Secret", group: "payment" },
  { key: "payment.razorpayTestMode", value: "false", description: "Use Razorpay test mode", group: "payment" },
  { key: "payment.isEnabled", value: "true", description: "Enable payment processing", group: "payment" },
  { key: "email.zeptoApiKey", value: "", description: "ZeptoMail API key", group: "email" },
  { key: "email.fromAddress", value: "noreply@vaidyagogate.org", description: "Default from email address", group: "email" },
  { key: "branding.logoUrl", value: "", description: "Site logo URL", group: "branding" },
  { key: "branding.faviconUrl", value: "", description: "Site favicon URL", group: "branding" },
  { key: "general.siteName", value: "Vaidya Gogate Memorial Foundation", description: "Site name", group: "general" },
  { key: "general.contactEmail", value: "admin@vaidyagogate.org", description: "Contact email", group: "general" },
  { key: "general.contactPhone", value: "", description: "Contact phone", group: "general" },
  { key: "events.defaultCancellationFee", value: "0", description: "Default cancellation fee for events", group: "events" },
  { key: "events.defaultRefundPercentage", value: "100", description: "Default refund percentage", group: "events" },
];

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
    });

    if (existing.length === 0) {
      await prisma.siteSetting.createMany({ data: DEFAULT_SETTINGS });
      const created = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
      return NextResponse.json({ items: created });
    }

    return NextResponse.json({ items: existing });
  } catch (err) {
    console.error("Site settings GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { settings } = data;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    const updates = Object.entries(settings) as [string, string][];

    for (const [key, value] of updates) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: {
          key,
          value: String(value),
          description: DEFAULT_SETTINGS.find((d) => d.key === key)?.description || "",
          group: DEFAULT_SETTINGS.find((d) => d.key === key)?.group || "general",
        },
      });
    }

    clearSettingsCache();
    const all = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
    return NextResponse.json({ items: all });
  } catch (err) {
    console.error("Site settings PATCH error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
