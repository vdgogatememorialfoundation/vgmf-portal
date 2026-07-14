import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const [orders, seminars, fellowships, autism] = await Promise.all([
    prisma.order.findMany({ where: { userId }, orderBy: { orderDate: "desc" }, take: 20 }),
    prisma.seminarRegistration.findMany({ where: { userId }, orderBy: { registrationDate: "desc" } }),
    prisma.fellowshipApplication.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.autismRegistration.findMany({ where: { userId }, orderBy: { registrationDate: "desc" } }),
  ]);

  return NextResponse.json({ orders, seminars, fellowships, autism });
}
