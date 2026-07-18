import { NextRequest, NextResponse } from "next/server";
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

    const scores = await prisma.judgeScore.findMany({
      where: { judgeId },
      orderBy: { createdAt: "desc" },
      include: {
        event: { select: { id: true, title: true, eventType: true } },
        casePresentation: {
          select: { id: true, topic: true, user: { select: { name: true, email: true } } },
        },
        competitionEntry: {
          select: { id: true, title: true, category: true, user: { select: { name: true, email: true } } },
        },
      },
    });

    return NextResponse.json({ scores });
  } catch (error) {
    console.error("Judge scores GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    const body = await req.json();

    const {
      casePresentationId,
      competitionEntryId,
      eventId,
      scientificMerit,
      innovation,
      feasibility,
      presentation,
      relevance,
      feedback,
    } = body;

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    if (!casePresentationId && !competitionEntryId) {
      return NextResponse.json(
        { error: "Either casePresentationId or competitionEntryId is required" },
        { status: 400 }
      );
    }

    const values = [scientificMerit, innovation, feasibility, presentation, relevance];
    if (values.some((v) => v === undefined || v === null || v < 0 || v > 100)) {
      return NextResponse.json(
        { error: "All 5 criteria scores (0-100) are required" },
        { status: 400 }
      );
    }

    const totalScore =
      Math.round(
        ((scientificMerit + innovation + feasibility + presentation + relevance) / 5) * 100
      ) / 100;

    const whereClause: any = {
      judgeId,
      eventId,
    };
    if (casePresentationId) {
      whereClause.casePresentationId = casePresentationId;
    }
    if (competitionEntryId) {
      whereClause.competitionEntryId = competitionEntryId;
    }

    const existing = await prisma.judgeScore.findFirst({ where: whereClause });

    let score;
    if (existing) {
      score = await prisma.judgeScore.update({
        where: { id: existing.id },
        data: {
          scientificMerit,
          innovation,
          feasibility,
          presentation,
          relevance,
          totalScore,
          feedback: feedback || null,
          scoredAt: new Date(),
        },
      });
    } else {
      score = await prisma.judgeScore.create({
        data: {
          judgeId,
          eventId,
          casePresentationId: casePresentationId || null,
          competitionEntryId: competitionEntryId || null,
          scientificMerit,
          innovation,
          feasibility,
          presentation,
          relevance,
          totalScore,
          feedback: feedback || null,
          scoredAt: new Date(),
        },
      });
    }

    if (casePresentationId) {
      const allScores = await prisma.judgeScore.findMany({
        where: { casePresentationId },
        select: { totalScore: true },
      });
      const avg =
        allScores.reduce((sum, s) => sum + (s.totalScore || 0), 0) / allScores.length || 0;
      await prisma.casePresentation.update({
        where: { id: casePresentationId },
        data: {
          totalScore: Math.round(avg * 100) / 100,
          status: "SCORED",
        },
      });
    }

    if (competitionEntryId) {
      const allScores = await prisma.judgeScore.findMany({
        where: { competitionEntryId },
        select: { totalScore: true },
      });
      const avg =
        allScores.reduce((sum, s) => sum + (s.totalScore || 0), 0) / allScores.length || 0;
      await prisma.competitionEntry.update({
        where: { id: competitionEntryId },
        data: { totalScore: Math.round(avg * 100) / 100 },
      });
    }

    return NextResponse.json({ score, updated: !!existing });
  } catch (error) {
    console.error("Judge scores POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
