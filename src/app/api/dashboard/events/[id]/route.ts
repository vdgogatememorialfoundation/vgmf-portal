import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isPublished: true,
      },
      include: {
        formFields: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      shortDesc: event.shortDesc,
      eventDate: event.eventDate,
      endDate: event.endDate,
      location: event.location,
      city: event.city,
      address: event.address,
      eventType: event.eventType,
      isFeatured: event.isFeatured,
      maxAttendees: event.maxAttendees,
      ticketPrice: event.ticketPrice,
      bannerUrl: event.bannerUrl,
      imageUrl: event.imageUrl,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      restrictToDoctors: event.restrictToDoctors,
      hasForm: event.hasForm,
      formTitle: event.formTitle,
      formDescription: event.formDescription,
      requiresPayment: event.requiresPayment,
      allowMultipleRegistrations: event.allowMultipleRegistrations,
      registrationCount: event._count.registrations,
      formFields: event.formFields.map((f) => ({
        id: f.id,
        fieldName: f.fieldName,
        fieldType: f.fieldType,
        label: f.label,
        placeholder: f.placeholder,
        required: f.required,
        options: f.options ? JSON.parse(f.options) : null,
        validation: f.validation ? JSON.parse(f.validation) : null,
        section: f.section,
      })),
    });
  } catch (error) {
    console.error("Event detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
