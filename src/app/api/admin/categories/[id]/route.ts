import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    const body = schema.parse(await req.json());
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let slug = existing.slug;
    if (body.name.trim() !== existing.name) {
      const base = slugify(body.name) || "section";
      slug = base;
      let n = 1;
      while (true) {
        const clash = await prisma.category.findUnique({ where: { slug } });
        if (!clash || clash.id === id) break;
        slug = `${base}-${n++}`;
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name.trim(),
        slug,
        description: body.description ?? existing.description,
        sortOrder: body.sortOrder ?? existing.sortOrder,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `This section still has ${count} product(s). Move or delete them first.` },
      { status: 400 },
    );
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
