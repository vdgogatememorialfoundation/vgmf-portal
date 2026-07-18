import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const knowledge: Record<string, { response: string; suggestions?: string[] }> = {
  registration: {
    response: "To register for an event, visit the Events section in your dashboard and click 'Register' on any published event. Fill in the required details and submit. Payment (if applicable) can be completed via Razorpay.",
    suggestions: ["Payment help", "Event info", "Certificate query"],
  },
  payment: {
    response: "Payments are processed securely via Razorpay. You can pay using UPI, cards, net banking, or wallets. After payment, your registration is confirmed instantly. Contact us if payment fails.",
    suggestions: ["Registration help", "Refund policy", "Certificate query"],
  },
  certificate: {
    response: "Your certificates are available in the Dashboard under 'My Certificates'. Certificates are issued after event completion. Each certificate has a unique verification code.",
    suggestions: ["Registration help", "Event info", "Other"],
  },
  event: {
    response: "VGMF hosts several events: National Seminar on Agnikarma & Viddhakarma (annual), Research Fellowship (year-round applications), and Autism Awareness Programme. Visit the Events section for details.",
    suggestions: ["Registration help", "Payment issue", "Certificate query"],
  },
  refund: {
    response: "Refunds are processed within 7-10 business days after cancellation. The refund amount depends on the event's cancellation policy (check event details). Refunds go to original payment method.",
    suggestions: ["Registration help", "Payment issue", "Other"],
  },
  autism: {
    response: "The Autism Awareness Programme provides free therapy support and community resources for families. Pre-registration is open. Visit /autism or call us for details.",
    suggestions: ["Registration help", "Event info", "Other"],
  },
  fellowship: {
    response: "The Viddhakarma Research Fellowship offers grants up to ₹75,000 for evidence-based Ayurvedic research. Apply through the Events section. Applications are reviewed by an expert panel quarterly.",
    suggestions: ["Registration help", "Event info", "Payment issue"],
  },
  contact: {
    response: "You can reach us at care@vaidyagogate.org or call +91 93737 92952. Our office is at Ramprasad Chambers, 368/1, Jawaharlal Nehru Rd, Pune 411002.",
    suggestions: ["Registration help", "Payment issue", "Certificate query"],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();
    const msg = message.toLowerCase();

    let matchedKey = "";
    let response = knowledge.contact.response;
    let suggestions = knowledge.contact.suggestions;

    for (const key of Object.keys(knowledge)) {
      if (msg.includes(key)) {
        matchedKey = key;
        response = knowledge[key].response;
        suggestions = knowledge[key].suggestions;
        break;
      }
    }

    let chatSession = null;
    let userId: string | null = null;

    try {
      const authSession = await auth();
      userId = (authSession?.user as any)?.id || null;
    } catch {}

    if (userId) {
      if (sessionId) {
        chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
      }
      if (!chatSession) {
        chatSession = await prisma.chatSession.create({
          data: {
            userId,
            title: `Support Chat - ${new Date().toLocaleDateString()}`,
            lastMessageAt: new Date(),
          },
        });
      } else {
        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { lastMessageAt: new Date() },
        });
      }

      await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          content: message,
          isFromUser: true,
        },
      });

      await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          content: response,
          isFromUser: false,
        },
      });
    }

    return NextResponse.json({
      reply: response,
      suggestions: suggestions || ["Registration help", "Payment issue", "Certificate query", "Event info", "Other"],
      sessionId: chatSession?.id || sessionId,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
