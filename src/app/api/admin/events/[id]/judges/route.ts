import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const judges = await prisma.user.findMany({
      where: { role: { in: ["JUDGE", "REVIEWER"] }, isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        phone: true,
      },
      orderBy: { name: "asc" },
    });

    const assigned = await prisma.judgeScore.findMany({
      where: { eventId: id },
      select: { judgeId: true },
      distinct: ["judgeId"],
    });

    const assignedIds = new Set(assigned.map(a => a.judgeId));

    return NextResponse.json({
      judges: judges.map(j => ({ ...j, isAssigned: assignedIds.has(j.id) })),
    });
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
    const { judgeIds } = await req.json();

    if (!Array.isArray(judgeIds)) {
      return NextResponse.json({ error: "judgeIds array required" }, { status: 400 });
    }

    const existingAssignments = await prisma.judgeScore.findMany({
      where: { eventId: id },
      select: { judgeId: true },
      distinct: ["judgeId"],
    });

    const existingIds = new Set(existingAssignments.map(a => a.judgeId));
    const newIds = new Set(judgeIds);

    for (const judgeId of judgeIds) {
      if (!existingIds.has(judgeId)) {
        await prisma.judgeScore.create({
          data: { judgeId, eventId: id },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
