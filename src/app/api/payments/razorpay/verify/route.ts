import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import crypto from "crypto";
import { generateETicketNumber } from "@/lib/razorpay";
import { getRazorpayKeys } from "@/lib/settings";
import { sendPaymentConfirmation, sendETicket } from "@/lib/email-notifications";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification parameters" }, { status: 400 });
    }

    const { keySecret } = await getRazorpayKeys();
    if (!keySecret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const existingReceipt = await prisma.paymentReceipt.findFirst({
      where: { razorpayPaymentId: razorpay_payment_id },
    });
    if (existingReceipt) {
      return NextResponse.json({ success: true, receiptNumber: existingReceipt.receiptNumber });
    }

    const registration = await prisma.eventRegistration.findFirst({
      where: { userId, paymentStatus: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: { event: true },
    });

    if (registration) {
      const eTicketNumber = generateETicketNumber();

      await prisma.eventRegistration.update({
        where: { id: registration.id },
        data: {
          paymentStatus: "COMPLETED",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          eTicketNumber,
        },
      });

      const receiptNumber = `VGR${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
      const receipt = await prisma.paymentReceipt.create({
        data: {
          userId,
          receiptNumber,
          relatedType: "EVENT",
          relatedId: registration.id,
          amount: registration.paymentAmount || 0,
          tax: 0,
          totalAmount: registration.paymentAmount || 0,
          paymentMethod: "Razorpay",
          razorpayPaymentId: razorpay_payment_id,
          status: "COMPLETED",
        },
      });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        sendPaymentConfirmation(
          { name: user.name, email: user.email },
          { id: receiptNumber, amount: registration.paymentAmount || 0, createdAt: new Date() },
          { title: registration.event.title }
        ).catch(e => console.error("Payment email failed:", e));

        sendETicket(
          { name: user.name, email: user.email },
          { id: registration.id, registrationNumber: registration.applicationId },
          { title: registration.event.title, date: registration.event.eventDate, venue: registration.event.location }
        ).catch(e => console.error("ETicket email failed:", e));
      }

      return NextResponse.json({ success: true, receiptNumber: receipt.receiptNumber });
    }

    const order = await prisma.order.findFirst({
      where: { userId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CONFIRMED",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });

      const receiptNumber = `VGO${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
      const receipt = await prisma.paymentReceipt.create({
        data: {
          userId,
          receiptNumber,
          relatedType: "ORDER",
          relatedId: order.id,
          amount: order.subTotal,
          tax: order.tax,
          totalAmount: order.totalAmount,
          paymentMethod: "Razorpay",
          razorpayPaymentId: razorpay_payment_id,
          status: "COMPLETED",
        },
      });

      return NextResponse.json({ success: true, receiptNumber: receipt.receiptNumber });
    }

    const formSubmission = await prisma.eventFormSubmission.findFirst({
      where: { userId, paymentStatus: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    if (formSubmission) {
      await prisma.eventFormSubmission.update({
        where: { id: formSubmission.id },
        data: {
          paymentStatus: "COMPLETED",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      const receiptNumber = `VGF${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
      const receipt = await prisma.paymentReceipt.create({
        data: {
          userId,
          receiptNumber,
          relatedType: "EVENT",
          relatedId: formSubmission.id,
          amount: formSubmission.paymentAmount || 0,
          tax: 0,
          totalAmount: formSubmission.paymentAmount || 0,
          paymentMethod: "Razorpay",
          razorpayPaymentId: razorpay_payment_id,
          status: "COMPLETED",
        },
      });

      return NextResponse.json({ success: true, receiptNumber: receipt.receiptNumber });
    }

    return NextResponse.json({ error: "No pending payment found to verify" }, { status: 404 });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
