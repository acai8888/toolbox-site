import { NextRequest, NextResponse } from "next/server";
import { recordUsage, getPopularTools } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const popular = await getPopularTools(10);
  return NextResponse.json({ popular });
}

export async function POST(request: NextRequest) {
  try {
    const { toolId, toolType } = await request.json();
    await recordUsage(toolId, toolType);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "记录失败" }, { status: 500 });
  }
}
