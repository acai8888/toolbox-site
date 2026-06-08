import { NextRequest, NextResponse } from "next/server";
import { getResources, getCategories, createResource } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const resources = await getResources();
  const categories = await getCategories();
  return NextResponse.json({ resources, categories });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resource = await createResource(body);
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
