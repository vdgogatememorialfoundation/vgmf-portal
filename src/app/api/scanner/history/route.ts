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

    const where: Record<string, any> = {};
    if (eventId) where.eventId = eventId;

    const scans = await prisma.scanLog.findMany({
      where,
      orderBy: { scannedAt: "desc" },
      take: 50,
      include: {
        registration: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        event: { select: { title: true } },
        scanner: { select: { name: true } },
      },
    });

    const formatted = scans.map((scan) => ({
      id: scan.id,
      ticketNumber: scan.ticketNumber,
      status: scan.status,
      scannedAt: scan.scannedAt,
      attendeeName: scan.registration?.user?.name || "—",
      attendeeEmail: scan.registration?.user?.email || "—",
      eventTitle: scan.event?.title || "—",
      scannedByName: scan.scanner?.name || "—",
    }));

    return NextResponse.json({ items: formatted });
  } catch (err) {
    console.error("Scanner history error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
