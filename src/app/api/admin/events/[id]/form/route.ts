import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, title: true, hasForm: true, formTitle: true, formDescription: true, requiresPayment: true, ticketPrice: true, allowMultipleRegistrations: true, eventType: true },
    });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const fields = await prisma.eventFormField.findMany({
      where: { eventId: id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ event, fields });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { hasForm, formTitle, formDescription, requiresPayment, ticketPrice, allowMultipleRegistrations, fields } = await req.json();

    await prisma.event.update({
      where: { id },
      data: {
        hasForm: hasForm ?? false,
        formTitle: formTitle || null,
        formDescription: formDescription || null,
        requiresPayment: requiresPayment ?? false,
        ticketPrice: ticketPrice || null,
        allowMultipleRegistrations: allowMultipleRegistrations ?? false,
      },
    });

    if (Array.isArray(fields)) {
      await prisma.eventFormField.deleteMany({ where: { eventId: id } });
      if (fields.length > 0) {
        await prisma.eventFormField.createMany({
          data: fields.map((f: any, i: number) => ({
            eventId: id,
            fieldName: f.fieldName,
            fieldType: f.fieldType || "text",
            label: f.label,
            placeholder: f.placeholder || null,
            required: f.required ?? false,
            options: f.options || null,
            validation: f.validation || null,
            sortOrder: f.sortOrder ?? i,
            section: f.section || null,
            isActive: true,
          })),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
