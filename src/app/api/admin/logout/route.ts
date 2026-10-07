import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  await clearAdminSession();
  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/admin/login", url.origin), 303);
}
