import { NextRequest, NextResponse } from "next/server";
import { getSubmissions, addSubmission, updateSubmissionStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") || undefined;
  const submissions = await getSubmissions(status);
  return NextResponse.json(submissions);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const sub = await addSubmission(data);
    return NextResponse.json(sub, { status: 201 });
  } catch {
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    await updateSubmissionStatus(id, status);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
