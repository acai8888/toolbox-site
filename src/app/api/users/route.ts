import { NextRequest, NextResponse } from "next/server";
import { createUser, getUsers } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: "请输入昵称" }, { status: 400 });
    const user = await createUser(name.trim(), email);
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
