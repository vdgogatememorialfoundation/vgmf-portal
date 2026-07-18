import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        eventDate: true,
        endDate: true,
        location: true,
        city: true,
        address: true,
        eventType: true,
        isPublished: true,
        ticketPrice: true,
        requiresPayment: true,
        requiresIdentityVerification: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc;
    if (data.eventDate !== undefined) updateData.eventDate = new Date(data.eventDate);
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.eventType !== undefined) updateData.eventType = data.eventType;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.maxAttendees !== undefined) updateData.maxAttendees = data.maxAttendees;
    if (data.ticketPrice !== undefined) updateData.ticketPrice = data.ticketPrice;
    if (data.bannerUrl !== undefined) updateData.bannerUrl = data.bannerUrl;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail;
    if (data.contactPhone !== undefined) updateData.contactPhone = data.contactPhone;
    if (data.restrictToDoctors !== undefined) updateData.restrictToDoctors = data.restrictToDoctors;
    if (data.requiresIdentityVerification !== undefined) updateData.requiresIdentityVerification = data.requiresIdentityVerification;
    if (data.registrationStartDate !== undefined) updateData.registrationStartDate = data.registrationStartDate ? new Date(data.registrationStartDate) : null;
    if (data.registrationDeadline !== undefined) updateData.registrationDeadline = data.registrationDeadline ? new Date(data.registrationDeadline) : null;
    if (data.cancellationDeadline !== undefined) updateData.cancellationDeadline = data.cancellationDeadline ? new Date(data.cancellationDeadline) : null;
    if (data.cancellationFee !== undefined) updateData.cancellationFee = data.cancellationFee;
    if (data.refundPercentage !== undefined) updateData.refundPercentage = data.refundPercentage;
    if (data.isCancellationEnabled !== undefined) updateData.isCancellationEnabled = data.isCancellationEnabled;
    if (data.isRegistrationOpen !== undefined) updateData.isRegistrationOpen = data.isRegistrationOpen;
    if (data.showCountdown !== undefined) updateData.showCountdown = data.showCountdown;

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
