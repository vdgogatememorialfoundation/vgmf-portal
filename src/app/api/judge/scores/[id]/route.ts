import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "JUDGE" && role !== "REVIEWER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const judgeId = (session.user as any).id;

    const score = await prisma.judgeScore.findFirst({
      where: { id, judgeId },
      include: {
        event: { select: { id: true, title: true, eventType: true } },
        casePresentation: {
          select: {
            id: true,
            topic: true,
            description: true,
            videoUrl: true,
            pptUrl: true,
            pdfUrl: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
        competitionEntry: {
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            fileUrls: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!score) {
      return NextResponse.json({ error: "Score not found" }, { status: 404 });
    }

    return NextResponse.json({ score });
  } catch (error) {
    console.error("Judge score detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
