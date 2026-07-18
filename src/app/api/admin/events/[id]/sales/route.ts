import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    const sales = await prisma.eventSale.findMany({
      where: { eventId },
      orderBy: { soldAt: "desc" },
    });

    return NextResponse.json({ sales });
  } catch (error) {
    console.error("Get event sales error:", error);
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const userId = (session.user as any).id;
    const body = await req.json();
    const { buyerName, buyerPhone, buyerEmail, items, paymentMethod } = body;

    if (!buyerName || !items || items.length === 0) {
      return NextResponse.json({ error: "Buyer name and items are required" }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
    const receiptNumber = `VGS${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;

    const sale = await prisma.eventSale.create({
      data: {
        eventId,
        sellerId: userId,
        buyerName,
        buyerPhone,
        buyerEmail,
        totalAmount,
        itemsJson: items,
        paymentMethod: paymentMethod || "CASH",
        receiptNumber,
      },
    });

    for (const item of items) {
      await prisma.eventProduct.update({
        where: { id: item.productId },
        data: { stockQty: { decrement: item.qty } },
      });
    }

    return NextResponse.json({ sale }, { status: 201 });
  } catch (error) {
    console.error("Create event sale error:", error);
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 });
  }
}
