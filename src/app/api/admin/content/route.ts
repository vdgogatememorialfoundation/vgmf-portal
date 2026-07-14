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
    return NextResponse.json(items);
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
    if (!data.key) {
      return NextResponse.json(
        { error: "Key is required" },
        { status: 400 }
      );
    }
    const item = await prisma.siteContent.upsert({
      where: { key: data.key },
      update: {
        value: data.value,
        description: data.description,
        contentType: data.contentType,
      },
      create: {
        key: data.key,
        value: data.value,
        description: data.description,
        contentType: data.contentType,
      },
    });
    return NextResponse.json(item, { status: data.id ? 200 : 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
