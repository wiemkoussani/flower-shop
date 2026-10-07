import Link from "next/link";
import { formatNaira } from "@/lib/format";

const FALLBACK = "/images/lilac.jpg";

type Props = {
  name: string;
  slug: string;
  imageUrl?: string | null;
  fromKobo: number;
  badge?: string | null;
};

export function ProductCard({ name, slug, imageUrl, fromKobo, badge }: Props) {
  return (
    <Link href={`/product/${slug}`} className="product-card group">
      <div className="product-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl || FALLBACK} alt={name} />
        {badge && <span className="product-card-badge">{badge}</span>}
      </div>
      <h3 className="product-card-title">{name}</h3>
      {fromKobo > 0 && (
        <p className="product-card-price">
          <em>from</em> <span>{formatNaira(fromKobo)}</span>
        </p>
      )}
      <span className="product-card-btn" style={{ color: "#ffffff" }}>
        View
      </span>
    </Link>
  );
}
