import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const COMP_CATEGORIES = ["ART", "ESSAY", "VIDEO", "PRESENTATION", "OTHER"];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const entries = await prisma.competitionEntry.findMany({
      where: { eventId: id },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { submittedAt: "desc" },
    });

    const settingsRecord = await prisma.siteContent.findUnique({
      where: { key: `comp_settings_${id}` },
    });

    let settings: Record<string, any> = {};
    if (settingsRecord) {
      try {
        settings = JSON.parse(settingsRecord.value);
      } catch {
        settings = {};
      }
    }

    const stats = COMP_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = entries.filter(e => e.category === cat).length;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({ entries, settings, categories: COMP_CATEGORIES, stats });
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
    const body = await req.json();

    if (body.settings) {
      const existing = await prisma.siteContent.findUnique({
        where: { key: `comp_settings_${id}` },
      });

      if (existing) {
        await prisma.siteContent.update({
          where: { key: `comp_settings_${id}` },
          data: { value: JSON.stringify(body.settings) },
        });
      } else {
        await prisma.siteContent.create({
          data: {
            key: `comp_settings_${id}`,
            value: JSON.stringify(body.settings),
            description: `Competition settings for event ${id}`,
            contentType: "json",
          },
        });
      }
    }

    if (body.entryId && body.entryStatus) {
      await prisma.competitionEntry.update({
        where: { id: body.entryId },
        data: { status: body.entryStatus, ...(body.feedback !== undefined ? { feedback: body.feedback } : {}) },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
