import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function generateTicketNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "VGMF-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { eventId, formData } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { formFields: { where: { isActive: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!event.isPublished) {
      return NextResponse.json({ error: "Event is not published" }, { status: 400 });
    }

    if (event.maxAttendees) {
      const count = await prisma.eventRegistration.count({
        where: { eventId, status: { not: "CANCELLED" } },
      });
      if (count >= event.maxAttendees) {
        return NextResponse.json({ error: "Event is full" }, { status: 400 });
      }
    }

    if (!event.allowMultipleRegistrations) {
      const existing = await prisma.eventRegistration.findFirst({
        where: { eventId, userId, status: { not: "CANCELLED" } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Already registered for this event", ticketNumber: existing.ticketNumber },
          { status: 409 }
        );
      }
    }

    const ticketNumber = generateTicketNumber();

    const [registration, formSubmission] = await prisma.$transaction([
      prisma.eventRegistration.create({
        data: {
          eventId,
          userId,
          ticketNumber,
          formData: formData || undefined,
          paymentStatus: event.requiresPayment ? "PENDING" : "COMPLETED",
          paymentAmount: event.ticketPrice || undefined,
        },
      }),
      event.hasForm && formData
        ? prisma.eventFormSubmission.create({
            data: {
              eventId,
              userId,
              formData,
              ticketNumber,
              paymentStatus: event.requiresPayment ? "PENDING" : "COMPLETED",
              paymentAmount: event.ticketPrice || undefined,
            },
          })
        : null,
    ]);

    return NextResponse.json({
      success: true,
      ticketNumber: registration.ticketNumber,
      registrationId: registration.id,
    }, { status: 201 });
  } catch (error) {
    console.error("Event registration API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
