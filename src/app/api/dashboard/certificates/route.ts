import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: Record<string, any> = { userId };
    if (status) where.status = status;
    if (type) where.certificateType = type;

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { issuedDate: "desc" },
    });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Certificates API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
