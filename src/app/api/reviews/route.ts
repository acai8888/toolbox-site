import { NextRequest, NextResponse } from "next/server";
import { getReviews, addReview, getAverageRating } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const toolId = request.nextUrl.searchParams.get("toolId");
  const toolType = request.nextUrl.searchParams.get("toolType") || "resource";
  if (!toolId) return NextResponse.json({ error: "缺少toolId" }, { status: 400 });
  const reviews = await getReviews(toolId, toolType);
  const rating = await getAverageRating(toolId, toolType);
  return NextResponse.json({ reviews, rating });
}

export async function POST(request: NextRequest) {
  try {
    const review = await request.json();
    const newReview = await addReview(review);
    return NextResponse.json(newReview, { status: 201 });
  } catch {
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}
