import Link from "next/link";
import { ShopSidebar } from "@/components/ShopSidebar";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sweet & Savoury Additions" };

export default async function SweetSavouryPage() {
  const [categories, treats] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.addon.findMany({
      where: { type: "treat", active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="site-wrap py-10 md:py-14">
      <h1 className="font-display mb-3 text-center text-4xl text-ink">Sweet &amp; Savoury</h1>
      <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted">
        These treats can be added on a bouquet or box product page under <strong>Add a treat</strong>.
        Gift sets already include cake, card and balloons.
      </p>
      <div className="main-rail-grid">
        <aside className="main-rail-left">
          <ShopSidebar categories={categories} />
        </aside>
        <div className="main-rail-right">
          <div className="product-grid">
            {treats.map((g) => (
              <div key={g.id} className="text-center">
                <div className="aspect-square overflow-hidden bg-[#f3eee6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.imageUrl || "/images/cake.jpg"}
                    alt={g.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-3 text-[15px]">{g.name}</h3>
                {g.priceKobo > 0 && (
                  <p className="mt-1 text-sm text-[#555]">{formatNaira(g.priceKobo)}</p>
                )}
                <p className="mt-1 text-[12px] text-muted">Ask on WhatsApp · or add on a bouquet</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/shop/hand-tied-bouquets" className="btn-shop">
              Shop bouquets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
