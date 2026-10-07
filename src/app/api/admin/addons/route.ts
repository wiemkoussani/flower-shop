import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(["wrapper", "card", "treat", "balloon"]),
  priceKobo: z.number().int().min(0),
  imageUrl: z.string().nullable().optional(),
  active: z.boolean().default(true),
  backSoon: z.boolean().default(false),
});

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = schema.parse(await req.json());
    const addon = await prisma.addon.create({ data: body });
    return NextResponse.json(addon);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
