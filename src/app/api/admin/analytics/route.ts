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
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersThisMonth,
      newUsersThisWeek,
      totalOrders,
      totalProducts,
      totalEvents,
      totalArticles,
      totalAnnouncements,
      revenueAgg,
      revenueThisMonthAgg,
      pendingRevenueAgg,
      seminarRegsCount,
      fellowshipAppsCount,
      autismRegsCount,
      eventRegistrationsCount,
      totalCertificates,
      formSubmissionsCount,
      recentOrders,
      recentSeminarRegs,
      recentFellowshipApps,
      recentAutismRegs,
      recentEventRegs,
      recentFormSubs,
      registrationsByEvent,
      revenueByStatus,
      ordersByStatus,
      activeUsers,
      pendingFellowships,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thisMonthStart } } }),
      prisma.user.count({ where: { createdAt: { gte: thisWeekStart } } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.event.count(),
      prisma.article.count(),
      prisma.announcement.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" }, createdAt: { gte: thisMonthStart } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: "PENDING" },
      }),
      prisma.seminarRegistration.count(),
      prisma.fellowshipApplication.count(),
      prisma.autismRegistration.count(),
      prisma.eventRegistration.count(),
      prisma.certificate.count(),
      prisma.eventFormSubmission.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      }),
      prisma.seminarRegistration.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ticketNumber: true,
          paymentStatus: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      }),
      prisma.fellowshipApplication.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          trackingNumber: true,
          status: true,
          areaOfInterest: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      }),
      prisma.autismRegistration.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          childName: true,
          parentName: true,
          eTicketNumber: true,
          createdAt: true,
        },
      }),
      prisma.eventRegistration.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          ticketNumber: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          event: { select: { title: true } },
          user: { select: { name: true } },
        },
      }),
      prisma.eventFormSubmission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          event: { select: { title: true } },
          user: { select: { name: true } },
        },
      }),
      prisma.event.findMany({
        select: {
          id: true,
          title: true,
          eventType: true,
          _count: {
            select: {
              registrations: true,
              formSubmissions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _sum: { totalAmount: true },
        _count: true,
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.fellowshipApplication.count({
        where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      }),
    ]);

    const totalRevenue = revenueAgg._sum.totalAmount ?? 0;
    const revenueThisMonth = revenueThisMonthAgg._sum.totalAmount ?? 0;
    const pendingRevenue = pendingRevenueAgg._sum.totalAmount ?? 0;

    const totalRegistrations =
      seminarRegsCount + fellowshipAppsCount + autismRegsCount + eventRegistrationsCount + formSubmissionsCount;

    const eventPopularity = registrationsByEvent
      .map((e) => ({
        id: e.id,
        title: e.title,
        eventType: e.eventType,
        registrations: e._count.registrations,
        formSubmissions: e._count.formSubmissions,
        total: e._count.registrations + e._count.formSubmissions,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const registrationTrend: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
      const count = await prisma.eventRegistration.count({
        where: { createdAt: { gte: dayStart, lt: dayEnd } },
      });
      registrationTrend.push({
        date: dayStart.toISOString().split("T")[0],
        count,
      });
    }

    const recentActivity = [
      ...recentOrders.map((o) => ({
        type: "order" as const,
        label: `Order ${o.orderNumber}`,
        detail: `${o.user?.name || "User"} — ₹${o.totalAmount.toLocaleString("en-IN")}`,
        status: o.status,
        date: o.createdAt,
      })),
      ...recentSeminarRegs.map((r) => ({
        type: "seminar" as const,
        label: "Seminar Registration",
        detail: `${r.user?.name || "User"} — ${r.ticketNumber}`,
        status: r.paymentStatus || "PENDING",
        date: r.createdAt,
      })),
      ...recentFellowshipApps.map((f) => ({
        type: "fellowship" as const,
        label: "Fellowship Application",
        detail: `${f.user?.name || "User"} — ${f.areaOfInterest || "N/A"}`,
        status: f.status,
        date: f.createdAt,
      })),
      ...recentAutismRegs.map((a) => ({
        type: "autism" as const,
        label: "Autism Registration",
        detail: `${a.childName} — ${a.eTicketNumber}`,
        status: "REGISTERED",
        date: a.createdAt,
      })),
      ...recentEventRegs.map((r) => ({
        type: "event_reg" as const,
        label: `Event: ${r.event?.title || "Event"}`,
        detail: `${r.user?.name || "User"} — ${r.ticketNumber}`,
        status: r.status,
        date: r.createdAt,
      })),
      ...recentFormSubs.map((s) => ({
        type: "form_sub" as const,
        label: `Form: ${s.event?.title || "Event"}`,
        detail: `${s.user?.name || "User"}`,
        status: s.status,
        date: s.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        newUsersThisWeek,
        totalRegistrations,
        totalOrders,
        totalProducts,
        totalEvents,
        totalArticles,
        totalAnnouncements,
        totalCertificates,
        seminarRegsCount,
        fellowshipAppsCount,
        autismRegsCount,
        eventRegistrationsCount,
        formSubmissionsCount,
        pendingFellowships,
      },
      revenue: {
        total: totalRevenue,
        thisMonth: revenueThisMonth,
        pending: pendingRevenue,
      },
      ordersByStatus: ordersByStatus.map((o) => ({
        status: o.status,
        count: o._count,
      })),
      revenueByStatus: revenueByStatus.map((o) => ({
        status: o.status,
        total: o._sum.totalAmount ?? 0,
        count: o._count,
      })),
      eventPopularity,
      registrationTrend,
      recentActivity,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
