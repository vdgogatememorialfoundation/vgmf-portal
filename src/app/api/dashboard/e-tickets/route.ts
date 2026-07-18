import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: Record<string, any> = { userId };
    if (status) where.status = status;

    const registrations = await prisma.eventRegistration.findMany({
      where,
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
            eventType: true,
            bannerUrl: true,
          },
        },
      },
      orderBy: { registrationDate: "desc" },
    });

    const eTickets = registrations.map((reg) => ({
      id: reg.id,
      ticketNumber: reg.ticketNumber,
      eTicketNumber: reg.eTicketNumber,
      eTicketUrl: reg.eTicketUrl,
      status: reg.status,
      paymentStatus: reg.paymentStatus,
      paymentAmount: reg.paymentAmount,
      isVerified: reg.isVerified,
      registrationDate: reg.registrationDate,
      event: reg.event,
    }));

    return NextResponse.json({ eTickets });
  } catch (error) {
    console.error("E-Tickets API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
