import { NextRequest, NextResponse } from "next/server";

const FELLOWSHIP_API = process.env.FELLOWSHIP_API_URL || "https://fellowship.vaidyagogate.org/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "/fellowships";

  try {
    const res = await fetch(`${FELLOWSHIP_API}${path}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch fellowship data" }, { status: 500 });
  }
}
