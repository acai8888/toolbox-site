import { NextRequest, NextResponse } from "next/server";
import { updateResource, deleteResource } from "@/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const { id, ...body } = await request.json();
    if (!id) return NextResponse.json({ error: "缺少ID" }, { status: 400 });
    const resource = await updateResource(id, body);
    if (!resource) return NextResponse.json({ error: "资源不存在" }, { status: 404 });
    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "缺少ID" }, { status: 400 });
    const success = await deleteResource(id);
    if (!success) return NextResponse.json({ error: "资源不存在" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
