import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { eventDate: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        shortDesc: true,
        eventDate: true,
        endDate: true,
        location: true,
        city: true,
        address: true,
        eventType: true,
        ticketPrice: true,
        maxAttendees: true,
        bannerUrl: true,
        imageUrl: true,
        isFeatured: true,
        restrictToDoctors: true,
        contactEmail: true,
        contactPhone: true,
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Public events API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
