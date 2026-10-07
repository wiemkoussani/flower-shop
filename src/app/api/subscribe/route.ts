import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = z.object({ email: z.string().email() }).parse(await req.json());
    await prisma.subscriber.upsert({
      where: { email: body.email },
      create: { email: body.email },
      update: {},
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
}
