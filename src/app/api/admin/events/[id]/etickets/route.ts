import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function generateTicketNumber(eventSlug: string): string {
  const prefix = eventSlug.substring(0, 4).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `VGMF-${prefix}-${ts}${rand}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, title: true, slug: true, eventDate: true, location: true, city: true },
    });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formSubmissions = await prisma.eventFormSubmission.findMany({
      where: { eventId: id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    const allRegistrations = [
      ...registrations.map(r => ({
        id: r.id,
        source: "registration" as const,
        user: r.user,
        ticketNumber: r.ticketNumber,
        eTicketNumber: r.eTicketNumber,
        eTicketUrl: r.eTicketUrl,
        status: r.status,
        paymentStatus: r.paymentStatus,
        date: r.registrationDate || r.createdAt,
      })),
      ...formSubmissions.map(s => ({
        id: s.id,
        source: "form" as const,
        user: s.user,
        ticketNumber: s.ticketNumber,
        eTicketNumber: s.ticketNumber,
        eTicketUrl: s.eTicketUrl,
        status: s.status,
        paymentStatus: s.paymentStatus,
        date: s.submittedAt || s.createdAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const stats = {
      total: allRegistrations.length,
      withETicket: allRegistrations.filter(r => r.eTicketNumber).length,
      pending: allRegistrations.filter(r => !r.eTicketNumber).length,
    };

    return NextResponse.json({ event, registrations: allRegistrations, stats });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { registrationId, bulk } = await req.json();

    const event = await prisma.event.findUnique({
      where: { id },
      select: { slug: true },
    });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let generated = 0;

    if (bulk) {
      const regs = await prisma.eventRegistration.findMany({
        where: { eventId: id, eTicketNumber: null },
      });
      for (const reg of regs) {
        const ticketNum = generateTicketNumber(event.slug);
        await prisma.eventRegistration.update({
          where: { id: reg.id },
          data: { eTicketNumber: ticketNum },
        });
        generated++;
      }

      const formSubs = await prisma.eventFormSubmission.findMany({
        where: { eventId: id, ticketNumber: null },
      });
      for (const sub of formSubs) {
        const ticketNum = generateTicketNumber(event.slug);
        await prisma.eventFormSubmission.update({
          where: { id: sub.id },
          data: { ticketNumber: ticketNum },
        });
        generated++;
      }
    } else if (registrationId) {
      const ticketNum = generateTicketNumber(event.slug);

      const reg = await prisma.eventRegistration.findUnique({ where: { id: registrationId } });
      if (reg) {
        await prisma.eventRegistration.update({
          where: { id: registrationId },
          data: { eTicketNumber: ticketNum },
        });
        generated++;
      } else {
        const sub = await prisma.eventFormSubmission.findUnique({ where: { id: registrationId } });
        if (sub) {
          await prisma.eventFormSubmission.update({
            where: { id: registrationId },
            data: { ticketNumber: ticketNum },
          });
          generated++;
        }
      }
    }

    return NextResponse.json({ success: true, generated });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
