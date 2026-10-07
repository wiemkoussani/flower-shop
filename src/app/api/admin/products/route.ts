import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  priceKobo: z.number().int().min(0),
  color: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  categoryId: z.string().min(1),
  active: z.boolean(),
  featured: z.boolean(),
  videoNote: z.string().optional(),
  specs: z.string().nullable().optional(),
  variants: z.array(variantSchema).min(1),
});

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = schema.parse(await req.json());
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        imageUrl: body.imageUrl || null,
        badge: body.badge || null,
        categoryId: body.categoryId,
        active: body.active,
        featured: body.featured,
        videoNote: body.videoNote,
        specs: body.specs || null,
        variants: {
          create: body.variants.map((v) => ({
            name: v.name,
            priceKobo: v.priceKobo,
            color: v.color || null,
            sortOrder: v.sortOrder,
          })),
        },
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
