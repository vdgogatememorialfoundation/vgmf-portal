import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const items = await prisma.siteContent.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json({ items });
  } catch (err) {
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
    
    // Save each setting as a key-value pair
    const entries = Object.entries(data);
    for (const [key, value] of entries) {
      await prisma.siteContent.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings save error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
