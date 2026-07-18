import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pages = await prisma.pageConfig.findMany({
      orderBy: [{ sortOrder: "asc" }, { path: "asc" }],
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, title, description, isEnabled, requiredRoles, showInMenu, menuLabel, menuIcon, sortOrder } = body;

    if (!path || !title) {
      return NextResponse.json({ error: "Path and title are required" }, { status: 400 });
    }

    const page = await prisma.pageConfig.upsert({
      where: { path },
      update: {
        title,
        description: description || undefined,
        isEnabled: isEnabled !== undefined ? isEnabled : undefined,
        requiredRoles: requiredRoles || undefined,
        showInMenu: showInMenu !== undefined ? showInMenu : undefined,
        menuLabel: menuLabel || undefined,
        menuIcon: menuIcon || undefined,
        sortOrder: sortOrder !== undefined ? sortOrder : undefined,
      },
      create: {
        path,
        title,
        description: description || "",
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        requiredRoles: requiredRoles || [],
        showInMenu: showInMenu !== undefined ? showInMenu : true,
        menuLabel: menuLabel || null,
        menuIcon: menuIcon || null,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error creating/updating page:", error);
    return NextResponse.json({ error: "Failed to save page config" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
    }

    await prisma.pageConfig.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
