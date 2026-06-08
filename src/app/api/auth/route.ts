import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (!password) return NextResponse.json({ error: "请输入密码" }, { status: 400 });
    const valid = await verifyPassword(password);
    if (!valid) return NextResponse.json({ error: "密码错误" }, { status: 401 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "验证失败" }, { status: 500 });
  }
}
