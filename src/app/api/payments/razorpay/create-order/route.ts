import { NextRequest, NextResponse } from "next/server";
import { getRazorpay, getRazorpayPublicKey } from "@/lib/razorpay";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, receipt, eventRegistrationId, orderId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!receipt) {
      return NextResponse.json({ error: "Receipt identifier is required" }, { status: 400 });
    }

    const razorpay = await getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      notes: {
        userId: (session.user as any).id,
        eventRegistrationId: eventRegistrationId || undefined,
        orderId: orderId || undefined,
      },
    });

    const keyId = await getRazorpayPublicKey();

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
