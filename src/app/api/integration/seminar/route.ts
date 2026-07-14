import { NextRequest, NextResponse } from "next/server";

const SEMINAR_API = process.env.SEMINAR_API_URL || "https://seminar.vaidyagogate.org/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "/seminars";

  try {
    const res = await fetch(`${SEMINAR_API}${path}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch seminar data" }, { status: 500 });
  }
}
