import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "JUDGE" && role !== "REVIEWER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const judgeId = (session.user as any).id;

    const scoredEventIds = await prisma.judgeScore.findMany({
      where: { judgeId },
      select: { eventId: true },
      distinct: ["eventId"],
    });
    const scoredSet = new Set(scoredEventIds.map((s) => s.eventId));

    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        OR: [
          { casePresentations: { some: {} } },
          { competitionEntries: { some: {} } },
          { judgeScores: { some: { judgeId } } },
        ],
      },
      orderBy: { eventDate: "desc" },
      include: {
        _count: {
          select: {
            casePresentations: true,
            competitionEntries: true,
            judgeScores: { where: { judgeId } },
          },
        },
      },
    });

    const enriched = events.map((event) => ({
      id: event.id,
      title: event.title,
      slug: event.slug,
      eventType: event.eventType,
      eventDate: event.eventDate,
      endDate: event.endDate,
      location: event.location,
      city: event.city,
      casePresentationCount: event._count.casePresentations,
      competitionEntryCount: event._count.competitionEntries,
      scoredCount: event._count.judgeScores,
      hasScored: scoredSet.has(event.id),
    }));

    return NextResponse.json({ events: enriched });
  } catch (error) {
    console.error("Judge events API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
