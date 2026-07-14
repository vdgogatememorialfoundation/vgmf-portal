import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const item = await prisma.event.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err) {
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
    const data = await req.json();

    const updateData: any = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
      if (!data.slug) {
        updateData.slug = slugify(data.title);
      }
    }
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc || null;
    if (data.eventDate !== undefined) updateData.eventDate = new Date(data.eventDate);
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.location !== undefined) updateData.location = data.location || null;
    if (data.city !== undefined) updateData.city = data.city || null;
    if (data.address !== undefined) updateData.address = data.address || null;
    if (data.eventType !== undefined) updateData.eventType = data.eventType;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.maxAttendees !== undefined) updateData.maxAttendees = data.maxAttendees || null;
    if (data.ticketPrice !== undefined) updateData.ticketPrice = data.ticketPrice || null;
    if (data.bannerUrl !== undefined) updateData.bannerUrl = data.bannerUrl || null;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
    if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail || null;
    if (data.contactPhone !== undefined) updateData.contactPhone = data.contactPhone || null;
    if (data.restrictToDoctors !== undefined) updateData.restrictToDoctors = data.restrictToDoctors;

    const item = await prisma.event.update({ where: { id }, data: updateData });
    return NextResponse.json(item);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
