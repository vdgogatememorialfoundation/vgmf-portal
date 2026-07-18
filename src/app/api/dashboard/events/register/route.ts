import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateApplicationId, generateETicketNumber } from "@/lib/razorpay";
import { sendEventRegistrationConfirmation, sendETicket } from "@/lib/email-notifications";

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

    if (!event.isRegistrationOpen) {
      return NextResponse.json({ error: "Registration is currently closed" }, { status: 400 });
    }

    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return NextResponse.json({ error: "Registration deadline has passed" }, { status: 400 });
    }

    if (event.registrationStartDate && new Date(event.registrationStartDate) > new Date()) {
      return NextResponse.json({ error: "Registration has not started yet" }, { status: 400 });
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
    const eTicketNumber = generateETicketNumber();
    const paymentStatus = event.requiresPayment ? "PENDING" : "COMPLETED";

    const currentYear = new Date().getFullYear();
    const registrationCount = await prisma.eventRegistration.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    });
    const applicationId = generateApplicationId(currentYear, registrationCount + 1);

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
        ticketNumber,
        applicationId,
        eTicketNumber,
        formData: formData || undefined,
        paymentStatus,
        paymentAmount: event.ticketPrice || undefined,
      },
    });

    if (event.hasForm && formData) {
      await prisma.eventFormSubmission.create({
        data: {
          eventId,
          userId,
          formData,
          ticketNumber,
          paymentStatus,
          paymentAmount: event.ticketPrice || undefined,
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const userObj = { name: user.name, email: user.email };
      const eventObj = { title: event.title, date: event.eventDate, venue: event.location };
      const regObj = { id: registration.id, registrationNumber: registration.applicationId };

      sendEventRegistrationConfirmation(userObj, eventObj, regObj).catch(e => console.error("Email send failed:", e));
      sendETicket(userObj, regObj, eventObj).catch(e => console.error("ETicket email failed:", e));
    }

    return NextResponse.json({
      success: true,
      ticketNumber: registration.ticketNumber,
      applicationId: registration.applicationId,
      eTicketNumber: registration.eTicketNumber,
      registrationId: registration.id,
      requiresPayment: event.requiresPayment,
      paymentAmount: event.ticketPrice,
    }, { status: 201 });
  } catch (error) {
    console.error("Event registration API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
