import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name || "Product" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, wrappers, cards, treats, balloons, related] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: { where: { active: true }, orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.addon.findMany({ where: { type: "wrapper", active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.addon.findMany({ where: { type: "card", active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.addon.findMany({ where: { type: "treat", active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.addon.findMany({ where: { type: "balloon", active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { active: true, slug: { not: slug }, featured: true },
      include: { variants: { where: { active: true }, orderBy: { priceKobo: "asc" } } },
      take: 4,
    }),
  ]);
  if (!product || !product.active) notFound();

  const isGiftSet = product.category.slug === "gift-sets";

  return (
    <div className="site-wrap py-8 md:py-12">
      <p className="text-[13px] text-muted">
        <Link href="/" className="hover:text-magenta">
          Home
        </Link>
        {" · "}
        <Link href={`/shop/${product.category.slug}`} className="hover:text-magenta">
          {product.category.name}
        </Link>
        {" · "}
        {product.name}
      </p>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-12 md:items-start">
        <div className="product-detail-media">
          <div className="relative overflow-hidden bg-[#f3eee6]">
            {product.badge && (
              <span className="absolute right-3 top-3 z-10 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm">
                {product.badge}
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                product.imageUrl || "/images/lilac.jpg"
              }
              alt={product.name}
              className="product-detail-img"
            />
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl text-ink md:text-5xl">{product.name}</h1>
          <p className="mt-5 leading-relaxed text-[#444]">{product.description}</p>

          {isGiftSet && (
            <div className="mt-5 border border-[#e8e2d8] bg-white px-4 py-3 text-sm text-[#333]">
              <p className="font-semibold text-magenta">Included in the set price</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Flower arrangement</li>
                <li>Bento cake</li>
                <li>Card</li>
                <li>Helium balloon(s)</li>
              </ul>
              <p className="mt-2 text-[12px] text-muted">
                Cake, card and balloons come with this set — they are not an extra charge on top.
              </p>
            </div>
          )}

          <div className="mt-4 border border-[#e8e2d8] bg-[#faf6ef] px-4 py-3 text-sm text-ink">
            <strong className="text-magenta">Video Approval:</strong>{" "}
            {product.videoNote ||
              "Once arranged, your florist will send a video via WhatsApp or email for your approval before delivery."}
          </div>

          <div className="mt-8">
            <ProductConfigurator
              productId={product.id}
              slug={product.slug}
              productName={product.name}
              imageUrl={product.imageUrl}
              variants={product.variants}
              wrappers={wrappers}
              cards={cards}
              treats={treats}
              balloons={balloons}
              isGiftSet={isGiftSet}
            />
          </div>

          {product.specs && !isGiftSet && (
            <details className="mt-8 border-t border-[#e8e2d8] pt-4">
              <summary className="cursor-pointer text-[13px] font-semibold tracking-wide uppercase">
                Product specifications
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm text-[#555]">{product.specs}</p>
            </details>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-[#e8e2d8] pt-12">
          <h2 className="font-display mb-8 text-center text-3xl">You may also like</h2>
          <div className="product-grid product-grid--compact">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                slug={p.slug}
                imageUrl={p.imageUrl}
                fromKobo={p.variants[0]?.priceKobo ?? 0}
                badge={p.badge}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
