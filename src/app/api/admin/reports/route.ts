import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "registrations";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const status = searchParams.get("status");
    const eventId = searchParams.get("eventId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const dateFilter: any = {};
    if (dateFrom) dateFilter.gte = new Date(dateFrom);
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      dateFilter.lte = endDate;
    }

    const hasDateFilter = Object.keys(dateFilter).length > 0;

    switch (type) {
      case "registrations": {
        const where: any = {};
        if (hasDateFilter) where.createdAt = dateFilter;
        if (status) where.status = status.toUpperCase();
        if (eventId) where.eventId = eventId;

        const [items, total] = await Promise.all([
          prisma.eventRegistration.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              ticketNumber: true,
              applicationId: true,
              status: true,
              paymentStatus: true,
              paymentAmount: true,
              isVerified: true,
              isCancelled: true,
              registrationDate: true,
              createdAt: true,
              user: { select: { id: true, name: true, email: true, phone: true } },
              event: { select: { id: true, title: true, eventType: true } },
            },
          }),
          prisma.eventRegistration.count({ where }),
        ]);
        return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit), type: "registrations" });
      }

      case "fellowships": {
        const where: any = {};
        if (hasDateFilter) where.createdAt = dateFilter;
        if (status) where.status = status.toUpperCase();

        const [items, total] = await Promise.all([
          prisma.fellowshipApplication.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              trackingNumber: true,
              applicationId: true,
              status: true,
              fullName: true,
              email: true,
              phoneNumber: true,
              areaOfInterest: true,
              institution: true,
              experienceYears: true,
              submittedAt: true,
              createdAt: true,
              user: { select: { id: true, name: true, email: true } },
            },
          }),
          prisma.fellowshipApplication.count({ where }),
        ]);
        return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit), type: "fellowships" });
      }

      case "orders": {
        const where: any = {};
        if (hasDateFilter) where.createdAt = dateFilter;
        if (status) where.status = status.toUpperCase();

        const [items, total] = await Promise.all([
          prisma.order.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              orderNumber: true,
              status: true,
              subTotal: true,
              discount: true,
              shippingCost: true,
              tax: true,
              totalAmount: true,
              razorpayPaymentId: true,
              orderDate: true,
              createdAt: true,
              user: { select: { id: true, name: true, email: true, phone: true } },
              items: {
                select: {
                  quantity: true,
                  unitPrice: true,
                  totalPrice: true,
                  product: { select: { name: true } },
                },
              },
            },
          }),
          prisma.order.count({ where }),
        ]);
        return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit), type: "orders" });
      }

      case "users": {
        const where: any = {};
        if (hasDateFilter) where.createdAt = dateFilter;
        if (status) where.role = status.toUpperCase();

        const [items, total] = await Promise.all([
          prisma.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              category: true,
              loginMethod: true,
              isActive: true,
              createdAt: true,
              _count: {
                select: {
                  orders: true,
                  seminarRegs: true,
                  fellowshipApps: true,
                  autismRegs: true,
                  eventRegistrations: true,
                  certificates: true,
                },
              },
            },
          }),
          prisma.user.count({ where }),
        ]);
        return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit), type: "users" });
      }

      case "certificates": {
        const where: any = {};
        if (hasDateFilter) where.createdAt = dateFilter;
        if (status) where.status = status.toUpperCase();

        const [items, total] = await Promise.all([
          prisma.certificate.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              title: true,
              certificateType: true,
              certificateNumber: true,
              eventTitle: true,
              status: true,
              issuedDate: true,
              createdAt: true,
              user: { select: { id: true, name: true, email: true } },
            },
          }),
          prisma.certificate.count({ where }),
        ]);
        return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit), type: "certificates" });
      }

      case "events": {
        const where: any = {};
        if (hasDateFilter) where.createdAt = dateFilter;
        if (status) where.eventType = status;

        const [items, total] = await Promise.all([
          prisma.event.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { eventDate: "desc" },
            select: {
              id: true,
              title: true,
              eventType: true,
              eventDate: true,
              location: true,
              isPublished: true,
              maxAttendees: true,
              ticketPrice: true,
              createdAt: true,
              _count: {
                select: {
                  registrations: true,
                  formSubmissions: true,
                  schedules: true,
                },
              },
            },
          }),
          prisma.event.count({ where }),
        ]);
        return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit), type: "events" });
      }

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }
  } catch (err) {
    console.error("Report generation error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
