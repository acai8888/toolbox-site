import { NextRequest, NextResponse } from "next/server";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "缺少userId" }, { status: 400 });
  const favorites = await getFavorites(userId);
  return NextResponse.json(favorites);
}

export async function POST(request: NextRequest) {
  try {
    const { userId, toolId, toolType } = await request.json();
    await addFavorite(userId, toolId, toolType);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "添加失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, toolId } = await request.json();
    await removeFavorite(userId, toolId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "移除失败" }, { status: 500 });
  }
}
