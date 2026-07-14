import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { event, data } = await req.json();

    switch (event) {
      case "seminar.registration.created":
        await sendEmail({
          to: [{ email: data.userEmail }],
          subject: "Seminar Registration Confirmed",
          htmlBody: `<h2>Registration Confirmed!</h2><p>Your seminar registration has been received.</p><p>Ticket: ${data.ticketNumber}</p>`,
        });
        break;

      case "fellowship.application.submitted":
        await sendEmail({
          to: [{ email: data.userEmail }],
          subject: "Fellowship Application Received",
          htmlBody: `<h2>Application Received!</h2><p>Your fellowship application has been submitted.</p><p>Tracking: ${data.trackingNumber}</p>`,
        });
        break;

      case "autism.registration.completed":
        await sendEmail({
          to: [{ email: data.userEmail }],
          subject: "Autism Programme Registration Complete",
          htmlBody: `<h2>Registration Complete!</h2><p>Your child is now registered for the Autism Awareness Programme.</p><p>E-Ticket: ${data.eTicketNumber}</p>`,
        });
        break;

      case "payment.success":
        await sendEmail({
          to: [{ email: data.userEmail }],
          subject: "Payment Successful",
          htmlBody: `<h2>Payment Confirmed!</h2><p>Your payment of ₹${data.amount} has been processed.</p><p>Order: ${data.orderNumber}</p>`,
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
