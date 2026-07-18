import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const eventType = searchParams.get("eventType") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }
    if (eventType) {
      where.eventType = eventType;
    }

    const [items, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { eventDate: "asc" },
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      events: items,
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const dateFields = ["eventDate", "endDate", "registrationStartDate", "registrationDeadline", "cancellationDeadline"];
    for (const f of dateFields) {
      if (data[f]) data[f] = new Date(data[f]);
      else data[f] = null;
    }

    let slug = data.slug || slugify(data.title);
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const item = await prisma.event.create({
      data: {
        title: data.title,
        slug,
        description: data.description || null,
        shortDesc: data.shortDesc || null,
        eventDate: data.eventDate,
        endDate: data.endDate,
        location: data.location || null,
        city: data.city || null,
        address: data.address || null,
        eventType: data.eventType || "Seminar",
        isPublished: data.isPublished ?? true,
        isFeatured: data.isFeatured ?? false,
        maxAttendees: data.maxAttendees || null,
        ticketPrice: data.ticketPrice || null,
        bannerUrl: data.bannerUrl || null,
        imageUrl: data.imageUrl || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        restrictToDoctors: data.restrictToDoctors ?? false,
        requiresIdentityVerification: data.requiresIdentityVerification ?? false,
        registrationStartDate: data.registrationStartDate,
        registrationDeadline: data.registrationDeadline,
        cancellationDeadline: data.cancellationDeadline,
        cancellationFee: data.cancellationFee || null,
        refundPercentage: data.refundPercentage || null,
        isCancellationEnabled: data.isCancellationEnabled ?? false,
        isRegistrationOpen: data.isRegistrationOpen ?? true,
        showCountdown: data.showCountdown ?? false,
      },
    });

    if (item.isPublished) {
      const eventTypeLower = (item.eventType || "event").toLowerCase();
      const existingAnnouncement = await prisma.announcement.findFirst({
        where: { title: `New ${item.eventType}: ${item.title}` },
      });
      if (!existingAnnouncement) {
        await prisma.announcement.create({
          data: {
            title: `New ${item.eventType}: ${item.title}`,
            summary: item.shortDesc || `A new ${item.eventType} event has been published.`,
            content: item.description || null,
            isPinned: true,
            isActive: true,
            linkUrl: `/${eventTypeLower}`,
          },
        });
      }
    }

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
