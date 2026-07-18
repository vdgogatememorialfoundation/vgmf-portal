import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;

    const registration = await prisma.eventRegistration.findFirst({
      where: { id, userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            eventDate: true,
            endDate: true,
            location: true,
            city: true,
            address: true,
            eventType: true,
            bannerUrl: true,
            contactEmail: true,
            contactPhone: true,
            schedules: {
              where: { isActive: true },
              orderBy: { sortOrder: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                startTime: true,
                endTime: true,
                speaker: true,
                location: true,
                track: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "E-ticket not found" }, { status: 404 });
    }

    const ticketStatus =
      registration.status === "CANCELLED"
        ? "CANCELLED"
        : registration.isVerified
        ? "SCANNED"
        : "VALID";

    return NextResponse.json({
      id: registration.id,
      ticketNumber: registration.ticketNumber,
      eTicketNumber: registration.eTicketNumber,
      status: ticketStatus,
      rawStatus: registration.status,
      paymentStatus: registration.paymentStatus,
      paymentAmount: registration.paymentAmount,
      isVerified: registration.isVerified,
      registrationDate: registration.registrationDate,
      event: registration.event,
      attendee: {
        name: registration.user.name,
        email: registration.user.email,
        phone: registration.user.phone,
      },
      qrData: `VGMF-${registration.ticketNumber}-${registration.event.id}`,
    });
  } catch (error) {
    console.error("E-Ticket detail API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
