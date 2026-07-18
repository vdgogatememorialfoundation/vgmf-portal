import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_PORTALS = [
  { portalName: "admin", urlPath: "/admin", description: "Administrator Portal", requiredRole: "ADMIN" },
  { portalName: "staff", urlPath: "/staff", description: "Staff Portal", requiredRole: "STAFF" },
  { portalName: "judge", urlPath: "/judge", description: "Judge Portal", requiredRole: "JUDGE" },
  { portalName: "scanner", urlPath: "/scanner", description: "Scanner Portal", requiredRole: "SCANNER" },
  { portalName: "trustee", urlPath: "/trustee", description: "Trustee Portal", requiredRole: "TRUSTEE" },
  { portalName: "reviewer", urlPath: "/reviewer", description: "Reviewer Portal", requiredRole: "REVIEWER" },
  { portalName: "doctor", urlPath: "/doctor", description: "Doctor Portal", requiredRole: "DOCTOR" },
];

export async function GET() {
  try {
    let portals = await prisma.portalLink.findMany({
      orderBy: { portalName: "asc" },
    });

    if (portals.length === 0) {
      await prisma.portalLink.createMany({
        data: DEFAULT_PORTALS.map(p => ({ ...p, isActive: true })),
      });
      portals = await prisma.portalLink.findMany({
        orderBy: { portalName: "asc" },
      });
    }

    return NextResponse.json(portals);
  } catch (error) {
    console.error("Error fetching portals:", error);
    return NextResponse.json({ error: "Failed to fetch portals" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, portalName, urlPath, description, isActive, requiredRole } = body;

    if (!portalName) {
      return NextResponse.json({ error: "Portal name is required" }, { status: 400 });
    }

    const updated = await prisma.portalLink.upsert({
      where: { id: id || portalName },
      update: {
        urlPath: urlPath || undefined,
        description: description || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        requiredRole: requiredRole !== undefined ? requiredRole : undefined,
      },
      create: {
        portalName,
        urlPath: urlPath || `/${portalName}`,
        description: description || "",
        isActive: isActive !== undefined ? isActive : true,
        requiredRole: requiredRole || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating portal:", error);
    return NextResponse.json({ error: "Failed to update portal" }, { status: 500 });
  }
}
