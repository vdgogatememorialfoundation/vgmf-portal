import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "STAFF" && role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ticketNumber, eventId } = await req.json();

    if (!ticketNumber || !eventId) {
      return NextResponse.json(
        { error: "ticketNumber and eventId are required" },
        { status: 400 }
      );
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: { ticketNumber },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        event: { select: { title: true, eventDate: true } },
      },
    });

    if (!registration || registration.eventId !== eventId) {
      return NextResponse.json({
        status: "INVALID",
        message: "Invalid ticket number",
      });
    }

    if (registration.status === "CANCELLED") {
      return NextResponse.json({
        status: "CANCELLED",
        message: "This ticket has been cancelled",
        attendee: {
          name: registration.user.name,
          email: registration.user.email,
        },
        event: registration.event.title,
        ticketNumber: registration.ticketNumber,
      });
    }

    const existingScan = await prisma.scanLog.findFirst({
      where: {
        registrationId: registration.id,
        eventId,
      },
      orderBy: { scannedAt: "desc" },
    });

    if (existingScan) {
      return NextResponse.json({
        status: "ALREADY_SCANNED",
        message: "Already scanned",
        scannedAt: existingScan.scannedAt,
        attendee: {
          name: registration.user.name,
          email: registration.user.email,
        },
        event: registration.event.title,
        ticketNumber: registration.ticketNumber,
      });
    }

    const scanLog = await prisma.scanLog.create({
      data: {
        eventId,
        registrationId: registration.id,
        ticketNumber: registration.ticketNumber,
        scannedBy: (session.user as any).id,
        status: "VALID",
      },
    });

    await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { isVerified: true },
    });

    return NextResponse.json({
      status: "VALID",
      message: "Entry verified",
      scannedAt: scanLog.scannedAt,
      attendee: {
        name: registration.user.name,
        email: registration.user.email,
        phone: registration.user.phone,
      },
      event: registration.event.title,
      ticketNumber: registration.ticketNumber,
    });
  } catch (err) {
    console.error("Scanner scan error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
