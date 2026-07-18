import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const schedules = await prisma.eventSchedule.findMany({
      where: { eventId: id },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ items: schedules });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "items array required" }, { status: 400 });
    }

    await prisma.eventSchedule.deleteMany({ where: { eventId: id } });

    if (items.length > 0) {
      await prisma.eventSchedule.createMany({
        data: items.map((item: any, i: number) => ({
          eventId: id,
          title: item.title,
          description: item.description || null,
          startTime: new Date(item.startTime),
          endTime: item.endTime ? new Date(item.endTime) : null,
          speaker: item.speaker || null,
          location: item.location || null,
          track: item.track || null,
          sortOrder: item.sortOrder ?? i,
          isActive: item.isActive ?? true,
        })),
      });
    }

    const updated = await prisma.eventSchedule.findMany({
      where: { eventId: id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ items: updated });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
