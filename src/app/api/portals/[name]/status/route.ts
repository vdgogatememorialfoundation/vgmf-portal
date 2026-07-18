import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const portalName = params.name.toLowerCase();
    
    const portal = await prisma.portalLink.findUnique({
      where: { portalName },
    });

    if (!portal) {
      return NextResponse.json({ 
        enabled: true, 
        message: "Portal not configured, allowing access" 
      });
    }

    return NextResponse.json({ 
      enabled: portal.isActive, 
      message: portal.isActive ? undefined : "This portal is currently unavailable. Please contact the administrator."
    });
  } catch (error) {
    console.error("Portal status error:", error);
    return NextResponse.json({ enabled: true });
  }
}
