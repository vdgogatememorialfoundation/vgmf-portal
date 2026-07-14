import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const items = await prisma.autismRegistration.findMany({
      where: {
        OR: [
          { childName: { contains: search, mode: "insensitive" } },
          { parentName: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { registrationDate: "desc" },
    });
    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
