import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { sendAdminCreatedAccountEmail, sendPasswordChangedEmail } from "@/lib/email-notifications";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const isActive = searchParams.get("isActive");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) {
      where.role = role.toUpperCase();
    }
    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true";
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
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
          loginMethod: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          password: true,
          seminarRegs: { select: { id: true } },
          fellowshipApps: { select: { id: true } },
          autismRegs: { select: { id: true } },
          eventRegistrations: { select: { id: true } },
          orders: { select: { id: true } },
          certificates: { select: { id: true } },
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
      }),
      prisma.user.count({ where }),
    ]);

    const enriched = items.map((u) => ({
      ...u,
      password: u.password ? "••••••••" : null,
      hasPassword: !!u.password,
      registrationsCount:
        u._count.seminarRegs +
        u._count.fellowshipApps +
        u._count.autismRegs +
        u._count.eventRegistrations,
    }));

    return NextResponse.json({
      items: enriched,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Users list error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const { name, email, phone, role, category, password } = data;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    const createData: any = {
      name: name || null,
      email,
      phone: phone || null,
      role: (role || "USER").toUpperCase(),
      category: category || null,
      isActive: true,
    };

    if (password) {
      createData.password = await bcrypt.hash(password, 12);
      createData.loginMethod = "password";
    }

    const user = await prisma.user.create({
      data: createData,
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

    if (password) {
      sendAdminCreatedAccountEmail(
        { name: user.name, email: user.email, role: user.role },
        password
      ).catch(e => console.error("Welcome email failed:", e));
    }

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();
    const { userId, ...updates } = data;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const allowedFields: any = {};
    const allowed = ["name", "email", "phone", "role", "category", "isActive", "address", "city", "state", "pincode"];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        allowedFields[key] = updates[key];
      }
    }
    if (updates.password) {
      allowedFields.password = await bcrypt.hash(updates.password, 12);
      sendPasswordChangedEmail(
        { id: userId, name: updates.name, email: updates.email },
        updates.password
      ).catch(e => console.error("Password change email failed:", e));
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
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
