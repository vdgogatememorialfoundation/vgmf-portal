import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
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
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    const eventWhere: any = {};
    if (eventId) {
      eventWhere.eventId = eventId;
    } else {
      const assigned = await prisma.event.findMany({
        where: {
          isPublished: true,
          OR: [
            { casePresentations: { some: {} } },
            { competitionEntries: { some: {} } },
            { judgeScores: { some: { judgeId } } },
          ],
        },
        select: { id: true },
      });
      eventWhere.eventId = { in: assigned.map((e) => e.id) };
    }

    const presentations = await prisma.casePresentation.findMany({
      where: eventWhere,
      orderBy: { submittedAt: "desc" },
      include: {
        event: { select: { id: true, title: true, eventType: true } },
        user: { select: { id: true, name: true, email: true } },
        scores: {
          where: { judgeId },
          select: {
            id: true,
            scientificMerit: true,
            innovation: true,
            feasibility: true,
            presentation: true,
            relevance: true,
            totalScore: true,
            feedback: true,
            scoredAt: true,
          },
        },
      },
    });

    const enriched = presentations.map((p) => ({
      ...p,
      myScore: p.scores.length > 0 ? p.scores[0] : null,
    }));

    return NextResponse.json({ presentations: enriched });
  } catch (error) {
    console.error("Judge case presentations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
