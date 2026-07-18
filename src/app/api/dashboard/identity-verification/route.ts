import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    const verifications = await prisma.identityVerification.findMany({
      where: { userId },
      include: { event: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(verifications);
  } catch (error) {
    console.error("Error fetching identity verifications:", error);
    return NextResponse.json({ error: "Failed to fetch verifications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { documentType, documentNumber, documentUrl, selfieUrl, eventId } = body;

    if (!documentType) {
      return NextResponse.json({ error: "Document type is required" }, { status: 400 });
    }

    const verification = await prisma.identityVerification.create({
      data: {
        userId,
        eventId: eventId || null,
        documentType,
        documentNumber: documentNumber || null,
        documentUrl: documentUrl || null,
        selfieUrl: selfieUrl || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(verification);
  } catch (error) {
    console.error("Error creating identity verification:", error);
    return NextResponse.json({ error: "Failed to create verification" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { id, documentType, documentNumber, documentUrl, selfieUrl, eventId } = body;

    if (!id) {
      return NextResponse.json({ error: "Verification ID is required" }, { status: 400 });
    }

    const verification = await prisma.identityVerification.findUnique({
      where: { id },
    });

    if (!verification) {
      return NextResponse.json({ error: "Verification not found" }, { status: 404 });
    }

    if (verification.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.identityVerification.update({
      where: { id },
      data: {
        documentType: documentType || verification.documentType,
        documentNumber: documentNumber !== undefined ? documentNumber : verification.documentNumber,
        documentUrl: documentUrl !== undefined ? documentUrl : verification.documentUrl,
        selfieUrl: selfieUrl !== undefined ? selfieUrl : verification.selfieUrl,
        eventId: eventId !== undefined ? eventId : verification.eventId,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating identity verification:", error);
    return NextResponse.json({ error: "Failed to update verification" }, { status: 500 });
  }
}
