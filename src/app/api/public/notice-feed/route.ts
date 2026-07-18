import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = new Date();
  const activeWindow = { isActive: true, OR: [{ startDate: null }, { startDate: { lte: now } }], AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }] } as any;
  const [announcements, notices] = await Promise.all([
    prisma.announcement.findMany({ where: activeWindow, orderBy: [{ isPinned: "desc" }, { priority: "desc" }, { createdAt: "desc" }], take: 5 }),
    prisma.siteNotice.findMany({ where: activeWindow, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 5 }),
  ]);
  return NextResponse.json({
    items: [
      ...announcements.map((a) => ({ id: a.id, title: a.title, summary: a.summary, linkUrl: a.linkUrl, type: "announcement" })),
      ...notices.map((n) => ({ id: n.id, title: n.title, summary: n.content, linkUrl: null, type: "notice" })),
    ],
  });
}
