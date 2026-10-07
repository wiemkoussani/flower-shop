import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  brandName: z.string().min(1),
  tagline: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  whatsapp: z.string().min(5),
  facebookUrl: z.string().url(),
  instagramUrl: z.string().url(),
  tiktokUrl: z.string().url(),
  bannerLeft: z.string(),
  bannerCenter: z.string(),
  bannerRight: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImageUrl: z.string(),
  heroCtaLabel: z.string(),
  heroCtaHref: z.string(),
});

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = schema.parse(await req.json());
    const settings = await prisma.siteSetting.upsert({
      where: { id: "main" },
      create: { id: "main", ...body },
      update: body,
    });
    return NextResponse.json(settings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
