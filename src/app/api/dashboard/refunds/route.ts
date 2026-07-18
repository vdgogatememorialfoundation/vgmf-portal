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

    const refunds = await prisma.refund.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ refunds });
  } catch (error) {
    console.error("Refunds GET API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { relatedType, relatedId, amount, reason, refundMethod } = body;

    if (!relatedType || !amount) {
      return NextResponse.json(
        { error: "relatedType and amount are required" },
        { status: 400 }
      );
    }

    const validTypes = ["EVENT", "ORDER"];
    if (!validTypes.includes(relatedType)) {
      return NextResponse.json(
        { error: `Invalid relatedType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
    }

    const refund = await prisma.refund.create({
      data: {
        userId,
        relatedType,
        relatedId: relatedId || undefined,
        amount,
        reason: reason || undefined,
        refundMethod: refundMethod || "Original",
      },
    });

    return NextResponse.json({ success: true, refund }, { status: 201 });
  } catch (error) {
    console.error("Refunds POST API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
