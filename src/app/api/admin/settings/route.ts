import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    let settings = await prisma.maintenanceSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!settings) {
      settings = await prisma.maintenanceSetting.create({
        data: { isEnabled: false },
      });
    }
    return NextResponse.json(settings);
  } catch (err) {
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
    let settings = await prisma.maintenanceSetting.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!settings) {
      settings = await prisma.maintenanceSetting.create({
        data: { isEnabled: false },
      });
    }
    const updated = await prisma.maintenanceSetting.update({
      where: { id: settings.id },
      data: {
        isEnabled: data.isEnabled !== undefined ? data.isEnabled : undefined,
        message: data.message !== undefined ? data.message : undefined,
        allowedIps: data.allowedIps !== undefined ? data.allowedIps : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
