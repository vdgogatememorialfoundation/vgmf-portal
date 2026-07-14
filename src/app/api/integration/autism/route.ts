import { NextRequest, NextResponse } from "next/server";

const AUTISM_API = process.env.AUTISM_API_URL || "https://autism.vaidyagogate.org/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "/registrations";

  try {
    const res = await fetch(`${AUTISM_API}${path}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch autism programme data" }, { status: 500 });
  }
}
