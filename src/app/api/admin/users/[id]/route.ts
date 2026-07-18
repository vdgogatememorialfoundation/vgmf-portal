import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        category: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        dob: true,
        gender: true,
        loginMethod: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: true,
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
        },
        seminarRegs: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            ticketNumber: true,
            isVerified: true,
            isCancelled: true,
            paymentStatus: true,
            registrationDate: true,
          },
        },
        fellowshipApps: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            trackingNumber: true,
            applicationId: true,
            status: true,
            areaOfInterest: true,
            submittedAt: true,
          },
        },
        autismRegs: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            childName: true,
            eTicketNumber: true,
            isFullyRegistered: true,
            registrationDate: true,
          },
        },
        eventRegistrations: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            ticketNumber: true,
            applicationId: true,
            status: true,
            paymentStatus: true,
            event: { select: { title: true } },
            registrationDate: true,
          },
        },
        certificates: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            certificateNumber: true,
            status: true,
            issuedDate: true,
          },
        },
        _count: {
          select: {
            orders: true,
            seminarRegs: true,
            fellowshipApps: true,
            autismRegs: true,
            eventRegistrations: true,
            certificates: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const enriched = {
      ...user,
      password: user.password ? "••••••••" : null,
      hasPassword: !!user.password,
    };

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Get user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = await req.json();

    const allowedFields: any = {};
    const allowed = [
      "name", "email", "phone", "role", "category", "isActive",
      "address", "city", "state", "pincode", "gender", "dob",
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        allowedFields[key] = data[key];
      }
    }
    if (data.password) {
      allowedFields.password = await bcrypt.hash(data.password, 12);
      allowedFields.loginMethod = "password";
    }
    if (data.resetPassword) {
      if (data.newPassword) {
        allowedFields.password = await bcrypt.hash(data.newPassword, 12);
      } else {
        return NextResponse.json({ error: "newPassword is required" }, { status: 400 });
      }
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: allowedFields,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        category: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, name: true, isActive: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = await req.json();

    const allowedFields: any = {};
    const allowed = [
      "name", "email", "phone", "role", "category", "isActive",
      "address", "city", "state", "pincode",
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        allowedFields[key] = data[key];
      }
    }
    if (data.password) {
      allowedFields.password = await bcrypt.hash(data.password, 12);
      allowedFields.loginMethod = "password";
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: allowedFields,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        category: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
