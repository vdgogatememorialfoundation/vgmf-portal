import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
    if (data.role !== undefined) {
      if (!["ADMIN", "STAFF", "USER"].includes(data.role)) {
        return NextResponse.json(
          { error: "Invalid role. Must be ADMIN, STAFF, or USER" },
          { status: 400 }
        );
      }
      allowedFields.role = data.role;
    }
    if (data.isActive !== undefined) {
      allowedFields.isActive = Boolean(data.isActive);
    }
    const item = await prisma.user.update({
      where: { id },
      data: allowedFields,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(item);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
