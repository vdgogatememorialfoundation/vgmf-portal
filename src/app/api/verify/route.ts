import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "certificate") {
    const code = searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
    }

    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode: code },
      select: {
        certificateNumber: true,
        title: true,
        description: true,
        certificateType: true,
        eventTitle: true,
        issuedDate: true,
        expiryDate: true,
        status: true,
        user: { select: { name: true } },
      },
    });

    if (!certificate) {
      return NextResponse.json({ valid: false, error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        number: certificate.certificateNumber,
        title: certificate.title,
        description: certificate.description,
        type: certificate.certificateType,
        event: certificate.eventTitle,
        holderName: certificate.user.name,
        issuedDate: certificate.issuedDate,
        expiryDate: certificate.expiryDate,
        status: certificate.status,
      },
    });
  }

  if (type === "candidates") {
    const eventId = searchParams.get("eventId");
    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId, status: "APPROVED", isCancelled: false },
      select: {
        applicationId: true,
        ticketNumber: true,
        registrationDate: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { registrationDate: "asc" },
    });

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true, eventDate: true },
    });

    return NextResponse.json({
      event: event ? { title: event.title, date: event.eventDate } : null,
      candidates: registrations.map((r) => ({
        applicationId: r.applicationId,
        ticketNumber: r.ticketNumber,
        name: r.user.name,
        registrationDate: r.registrationDate,
      })),
      total: registrations.length,
    });
  }

  return NextResponse.json({ error: "Invalid type parameter. Use 'certificate' or 'candidates'." }, { status: 400 });
}
