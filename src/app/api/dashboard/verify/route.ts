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
    const body = await req.json();
    const { documentType, documentNumber, documentUrl, selfieUrl } = body;

    if (!documentType) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 });
    }

    const validTypes = ["Aadhaar", "PAN", "Passport", "VoterID", "DrivingLicense"];
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: `Invalid document type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const pending = await prisma.identityVerification.findFirst({
      where: { userId, status: "PENDING" },
    });

    if (pending) {
      return NextResponse.json(
        { error: "You already have a pending verification request" },
        { status: 409 }
      );
    }

    const verification = await prisma.identityVerification.create({
      data: {
        userId,
        documentType,
        documentNumber: documentNumber || undefined,
        documentUrl: documentUrl || undefined,
        selfieUrl: selfieUrl || undefined,
      },
    });

    return NextResponse.json({ success: true, verification }, { status: 201 });
  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
