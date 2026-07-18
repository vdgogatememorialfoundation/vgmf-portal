import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const type = searchParams.get("type");

    const where: Record<string, any> = { isPublished: true };
    if (type) where.eventType = type;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          formFields: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
          _count: { select: { registrations: true } },
        },
        orderBy: { eventDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    const formatted = events.map((event) => ({
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
        section: f.section,
      })),
    }));

    return NextResponse.json({
      events: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Events API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
