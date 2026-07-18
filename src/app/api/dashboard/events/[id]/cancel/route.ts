import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendEventCancellationConfirmation } from "@/lib/email-notifications";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id: eventId } = await params;
    const body = await req.json();
    const { registrationId, reason } = body;

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: "Cancellation reason is required" }, { status: 400 });
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: { event: true, user: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (registration.eventId !== eventId) {
      return NextResponse.json({ error: "Registration does not belong to this event" }, { status: 400 });
    }

    if (registration.isCancelled) {
      return NextResponse.json({ error: "Registration is already cancelled" }, { status: 400 });
    }

    if (registration.status === "CANCELLED") {
      return NextResponse.json({ error: "Registration is already cancelled" }, { status: 400 });
    }

    const event = registration.event;

    if (!event.isCancellationEnabled) {
      return NextResponse.json(
        { error: "Cancellation is not enabled for this event" },
        { status: 400 }
      );
    }

    if (event.cancellationDeadline && new Date(event.cancellationDeadline) < new Date()) {
      return NextResponse.json(
        { error: "Cancellation deadline has passed" },
        { status: 400 }
      );
    }

    const paidAmount = registration.paymentAmount || 0;
    const refundPercentage = event.refundPercentage ?? 100;
    const cancellationFee = event.cancellationFee ?? 0;
    const refundAmount = Math.max(0, (paidAmount * refundPercentage) / 100 - cancellationFee);

    await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: {
        status: "CANCELLED",
        isCancelled: true,
        cancelledAt: new Date(),
        cancellationReason: reason.trim(),
        refundAmount,
        refundStatus: refundAmount > 0 ? "PENDING" : "NONE",
      },
    });

    if (refundAmount > 0 && paidAmount > 0) {
      await prisma.refund.create({
        data: {
          userId,
          relatedType: "EVENT",
          relatedId: registrationId,
          amount: refundAmount,
          reason: reason.trim(),
          status: "PENDING",
        },
      });
    }

    sendEventCancellationConfirmation(
      { name: registration.user.name, email: registration.user.email },
      { title: event.title },
      { id: registrationId }
    ).catch(e => console.error("Cancellation email failed:", e));

    return NextResponse.json({
      success: true,
      message: "Registration cancelled successfully",
      refundAmount,
      cancellationFee,
      paidAmount,
      refundPercentage,
    });
  } catch (error) {
    console.error("Cancel registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
