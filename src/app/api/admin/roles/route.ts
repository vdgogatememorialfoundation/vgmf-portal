import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALL_PERMISSIONS = [
  "read:users", "write:users", "delete:users",
  "read:events", "write:events", "delete:events",
  "read:registrations", "write:registrations", "delete:registrations",
  "read:orders", "write:orders", "delete:orders",
  "read:certificates", "write:certificates", "delete:certificates",
  "read:reports", "write:reports", "delete:reports",
  "read:settings", "write:settings", "delete:settings",
  "read:announcements", "write:announcements", "delete:announcements",
  "read:articles", "write:articles", "delete:articles",
  "read:products", "write:products", "delete:products",
  "read:chats", "write:chats", "delete:chats",
  "read:reviews", "write:reviews", "delete:reviews",
  "read:fellowships", "write:fellowships", "delete:fellowships",
  "write:scan",
  "write:scores",
  "write:reviews",
];

const DEFAULT_ROLES = [
  {
    roleName: "ADMIN",
    description: "Full system access",
    permissions: ALL_PERMISSIONS,
  },
  {
    roleName: "STAFF",
    description: "Staff members with event and order management access",
    permissions: ["read:events", "write:events", "read:registrations", "write:registrations", "read:orders", "write:orders", "read:users", "read:reports"],
  },
  {
    roleName: "JUDGE",
    description: "Judges for evaluating competitions",
    permissions: ["read:events", "write:scores"],
  },
  {
    roleName: "REVIEWER",
    description: "Reviewers for evaluating applications",
    permissions: ["read:events", "write:reviews"],
  },
  {
    roleName: "TRUSTEE",
    description: "Board trustees with fellowship oversight",
    permissions: ["read:fellowships", "write:fellowships", "read:events"],
  },
  {
    roleName: "SCANNER",
    description: "Event ticket scanners",
    permissions: ["write:scan"],
  },
  {
    roleName: "DOCTOR",
    description: "Medical professionals",
    permissions: ["read:events", "write:events"],
  },
  {
    roleName: "USER",
    description: "Standard user with limited access",
    permissions: [],
  },
];

export async function GET() {
  try {
    let roles = await prisma.userRole.findMany({
      orderBy: { roleName: "asc" },
    });

    if (roles.length === 0) {
      await prisma.userRole.createMany({
        data: DEFAULT_ROLES.map(r => ({ ...r, isActive: true })),
      });
      roles = await prisma.userRole.findMany({
        orderBy: { roleName: "asc" },
      });
    }

    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, roleName, description, permissions, isActive } = body;

    if (!roleName) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updated = await prisma.userRole.upsert({
      where: { id: id || roleName },
      update: updateData,
      create: {
        roleName,
        description: description || "",
        permissions: permissions || [],
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
