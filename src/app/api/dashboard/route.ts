import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true, category: true, city: true, createdAt: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [orders, seminars, fellowships, autism, announcements, events] = await Promise.all([
      prisma.order.findMany({ where: { userId }, orderBy: { orderDate: "desc" }, take: 20 }),
      prisma.seminarRegistration.findMany({ where: { userId }, orderBy: { registrationDate: "desc" }, take: 10 }),
      prisma.fellowshipApplication.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
      prisma.autismRegistration.findMany({ where: { userId }, orderBy: { registrationDate: "desc" }, take: 10 }),
      prisma.announcement.findMany({
        where: { isActive: true },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        take: 3,
      }),
      prisma.event.findMany({ where: { isPublished: true }, orderBy: { eventDate: "desc" }, take: 5 }),
    ]);

    const category = user.category || "GENERAL";

    return NextResponse.json({
      user,
      category,
      orders,
      seminars,
      fellowships,
      autism,
      announcements,
      events,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
