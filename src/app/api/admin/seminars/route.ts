import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (status === "verified") {
      where.isVerified = true;
    } else if (status === "pending") {
      where.isVerified = false;
    } else if (status === "cancelled") {
      where.isCancelled = true;
    }

    const [items, total] = await Promise.all([
      prisma.seminarRegistration.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.seminarRegistration.count({ where }),
    ]);

    return NextResponse.json({
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
    const body = await req.json();
    const { id, isVerified, isCancelled, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const data: any = {};
    if (isVerified !== undefined) data.isVerified = isVerified;
    if (isCancelled !== undefined) data.isCancelled = isCancelled;
    if (paymentStatus !== undefined) data.paymentStatus = paymentStatus;

    const updated = await prisma.seminarRegistration.update({
      where: { id },
      data,
    });

    return NextResponse.json({ item: updated });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
