import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = z
      .object({
        question: z.string().min(1),
        answer: z.string().min(1),
        sortOrder: z.number().int().default(0),
        published: z.boolean().default(true),
      })
      .parse(await req.json());
    const faq = await prisma.faq.create({ data: body });
    return NextResponse.json(faq);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
