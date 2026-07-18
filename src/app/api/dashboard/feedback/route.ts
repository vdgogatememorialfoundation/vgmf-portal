import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const body = await req.json();
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1 to 5" }, { status: 400 });

  const checkedIn = await prisma.eventRegistration.count({ where: { userId, OR: [{ isVerified: true }, { scanLogs: { some: {} } }] } });
  if (checkedIn === 0) return NextResponse.json({ error: "Feedback is available after event check-in." }, { status: 403 });

  const review = await prisma.siteReview.create({
    data: {
      userId,
      rating,
      title: String(body.title || "").slice(0, 120) || null,
      content: String(body.content || "").slice(0, 1200) || null,
      category: String(body.category || "GENERAL").slice(0, 40),
    },
  });
  return NextResponse.json({ success: true, review });
}
