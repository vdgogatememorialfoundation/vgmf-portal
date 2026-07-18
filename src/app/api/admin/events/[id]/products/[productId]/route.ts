import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;
    const body = await req.json();
    const { name, description, price, stockQty, isActive } = body;

    const product = await prisma.eventProduct.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        stockQty: stockQty !== undefined ? parseInt(stockQty) : undefined,
        isActive,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update event product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;

    await prisma.eventProduct.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete event product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
