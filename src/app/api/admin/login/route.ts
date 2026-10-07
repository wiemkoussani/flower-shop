import { NextResponse } from "next/server";
import { checkAdminPassword, createAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const password = String(body.password || "");
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
