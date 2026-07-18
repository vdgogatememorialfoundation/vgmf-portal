import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { phoneNumber, organization, designation } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const ticketNumber = `VGMF-SEMI-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const registration = await prisma.seminarRegistration.create({
      data: {
        userId,
        ticketNumber,
        phoneNumber,
        organization: organization || null,
        designation: designation || null,
        isVerified: false,
      },
    });

    return NextResponse.json({
      success: true,
      ticketNumber: registration.ticketNumber,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error("Seminar registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
