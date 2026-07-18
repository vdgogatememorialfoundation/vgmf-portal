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

    const addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Addresses GET API error:", error);
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
    const { label, addressLine1, addressLine2, city, state, pincode, country, phone, isDefault } = body;

    if (!addressLine1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "addressLine1, city, state, and pincode are required" },
        { status: 400 }
      );
    }

    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.userAddress.create({
      data: {
        userId,
        label: label || "Home",
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        state,
        pincode,
        country: country || "India",
        phone: phone || undefined,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ success: true, address }, { status: 201 });
  } catch (error) {
    console.error("Addresses POST API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
