import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "STAFF" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    const totalRegistrations = await prisma.eventRegistration.count({
      where: { eventId, status: { not: "CANCELLED" } },
    });

    const allScans = await prisma.scanLog.findMany({
      where: { eventId },
      select: { status: true, scannedAt: true },
      orderBy: { scannedAt: "desc" },
    });

    const valid = allScans.filter((s) => s.status === "VALID").length;
    const alreadyScanned = allScans.filter((s) => s.status === "ALREADY_SCANNED").length;
    const invalid = allScans.filter((s) => s.status === "INVALID").length;
    const totalScanned = valid + alreadyScanned + invalid;

    return NextResponse.json({
      totalScanned,
      valid,
      alreadyScanned,
      invalid,
      totalRegistrations,
    });
  } catch (err) {
    console.error("Scanner stats error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
