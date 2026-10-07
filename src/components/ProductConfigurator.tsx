"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { formatNaira } from "@/lib/format";

type Variant = { id: string; name: string; priceKobo: number; color: string | null };
type Addon = {
  id: string;
  name: string;
  slug?: string;
  type: string;
  priceKobo: number;
  imageUrl: string | null;
  backSoon: boolean;
};

type Props = {
  productId: string;
  slug: string;
  productName: string;
  imageUrl?: string | null;
  variants: Variant[];
  wrappers: Addon[];
  cards: Addon[];
  treats: Addon[];
  balloons: Addon[];
  /** Gift sets already include cake/card/balloons — hide optional extras */
  isGiftSet?: boolean;
};

function AddonGrid({
  items,
  selectedIds,
  onToggle,
  fallbackImg,
  showMore,
  onToggleMore,
}: {
  items: Addon[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  fallbackImg: string;
  showMore: boolean;
  onToggleMore: () => void;
}) {
  const visible = showMore ? items : items.slice(0, 4);
  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {visible.map((item) => {
          const active = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.backSoon}
              onClick={() => onToggle(item.id)}
              className={`border p-2 text-left text-[12px] disabled:opacity-50 ${
                active ? "border-black" : "border-[#ddd]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl || fallbackImg}
                alt=""
                className="mb-2 aspect-square w-full object-cover"
              />
              <span className="block font-medium">{item.name}</span>
              {item.backSoon ? (
                <span className="text-[#666]">Back soon</span>
              ) : item.priceKobo > 0 ? (
                <span className="text-[#666]">{formatNaira(item.priceKobo)}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {items.length > 4 && (
        <button type="button" className="mt-2 text-[12px] underline" onClick={onToggleMore}>
          {showMore ? "SHOW LESS" : "SHOW MORE"}
        </button>
      )}
    </>
  );
}

export function ProductConfigurator({
  productId,
  slug,
  productName,
  imageUrl,
  variants,
  wrappers,
  cards,
  treats,
  balloons,
  isGiftSet = false,
}: Props) {
  const [variantId, setVariantId] = useState(variants[0]?.id || "");
  const [wrapperId, setWrapperId] = useState(wrappers[0]?.id || "");
  const [cardId, setCardId] = useState(cards.find((c) => c.priceKobo === 0)?.id || cards[0]?.id || "");
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [showMoreCards, setShowMoreCards] = useState(false);
  const [showMoreTreats, setShowMoreTreats] = useState(false);
  const [showMoreBalloons, setShowMoreBalloons] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  const selected = useMemo(
    () => variants.find((v) => v.id === variantId) || variants[0],
    [variants, variantId],
  );
  const wrapper = wrappers.find((w) => w.id === wrapperId);
  const card = cards.find((c) => c.id === cardId);
  const allExtras = [...treats, ...balloons];
  const selectedExtras = allExtras.filter((g) => extraIds.includes(g.id));

  const total =
    (selected?.priceKobo || 0) +
    (wrapper?.priceKobo || 0) +
    (card?.priceKobo || 0) +
    selectedExtras.reduce((n, g) => n + g.priceKobo, 0);

  const enquireOnly = (selected?.priceKobo || 0) <= 0;
  const cardIsComplimentary =
    !!card &&
    (card.slug === "card-message-free" || card.name.toLowerCase().includes("complimentary"));
  const hasUnpricedExtras =
    selectedExtras.some((g) => g.priceKobo <= 0) ||
    (!!card && card.priceKobo <= 0 && !cardIsComplimentary);
  const needsWhatsApp = enquireOnly || hasUnpricedExtras;
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349155353128";

  const waMessage = encodeURIComponent(
    [
      `Hello Flower Room NG — I’d like a quote for: ${productName}`,
      selected ? `Option: ${selected.name}` : null,
      selectedExtras.length ? `Extras: ${selectedExtras.map((g) => g.name).join(", ")}` : null,
      card ? `Card: ${card.name}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  function toggleExtra(id: string) {
    setExtraIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }

  function addToCart() {
    if (!selected || needsWhatsApp) return;
    const extras = [
      wrapper ? `Wrap: ${wrapper.name}` : null,
      card ? `Card: ${card.name}` : null,
      ...selectedExtras.map((g) => g.name),
    ]
      .filter(Boolean)
      .join(" · ");

    addItem({
      productId,
      variantId: selected.id,
      slug,
      productName,
      variantName: extras ? `${selected.name} · ${extras}` : selected.name,
      imageUrl,
      unitKobo: total,
    });
    router.push("/cart");
  }

  const visibleCards = showMoreCards ? cards : cards.slice(0, 4);
  const showExtras = !isGiftSet && !enquireOnly;

  return (
    <div className="space-y-7">
      {!enquireOnly && (
        <p className="text-xl font-semibold text-ink">{formatNaira(selected?.priceKobo || 0)}</p>
      )}
      {enquireOnly && (
        <p className="text-[15px] leading-relaxed text-[#555]">
          Custom quote — message us on WhatsApp and we&apos;ll confirm availability and price for you.
        </p>
      )}

      {variants.length > 0 && !enquireOnly && (
        <div>
          <p className="mb-2 text-[13px] font-medium text-[#333]">Select size</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const active = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`border px-3 py-2.5 text-[13px] transition-colors ${
                    active ? "border-black bg-black text-white" : "border-[#ccc] bg-white text-[#222] hover:border-black"
                  }`}
                >
                  {v.priceKobo > 0 ? `${v.name} (${formatNaira(v.priceKobo)})` : v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!enquireOnly && wrappers.length > 0 && (
        <div>
          <p className="mb-2 text-[13px] font-medium text-[#333]">Select wrapper / hatbox</p>
          <div className="grid grid-cols-4 gap-2">
            {wrappers.map((w) => {
              const active = w.id === wrapperId;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWrapperId(w.id)}
                  className={`border p-1 text-center text-[11px] ${active ? "border-black" : "border-[#ddd]"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.imageUrl || "/images/roses.jpg"}
                    alt={w.name}
                    className="mb-1 aspect-square w-full object-cover"
                  />
                  {w.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showExtras && cards.length > 0 && (
        <div>
          <p className="mb-2 text-[13px] font-medium text-[#333]">Select card</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {visibleCards.map((c) => {
              const active = c.id === cardId;
              const isFree = c.slug === "card-message-free" || c.name.toLowerCase().includes("complimentary");
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCardId(c.id)}
                  className={`border p-2 text-left text-[12px] ${active ? "border-black" : "border-[#ddd]"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.imageUrl || "/images/ivory.jpg"}
                    alt=""
                    className="mb-2 aspect-[4/3] w-full object-cover"
                  />
                  <span className="block font-medium">{c.name}</span>
                  {c.priceKobo > 0 ? (
                    <span className="text-[#666]">{formatNaira(c.priceKobo)}</span>
                  ) : isFree ? (
                    <span className="text-[#666]">Complimentary</span>
                  ) : null}
                </button>
              );
            })}
          </div>
          {cards.length > 4 && (
            <button type="button" className="mt-2 text-[12px] underline" onClick={() => setShowMoreCards((v) => !v)}>
              {showMoreCards ? "SHOW LESS" : "SHOW MORE"}
            </button>
          )}
        </div>
      )}

      {showExtras && treats.length > 0 && (
        <div>
          <p className="mb-2 text-[13px] font-medium text-[#333]">Add a treat</p>
          <p className="mb-2 text-[12px] text-muted">
            Sweet &amp; savoury — we&apos;ll confirm prices on WhatsApp if needed.
          </p>
          <AddonGrid
            items={treats}
            selectedIds={extraIds}
            onToggle={toggleExtra}
            fallbackImg="/images/cake.jpg"
            showMore={showMoreTreats}
            onToggleMore={() => setShowMoreTreats((v) => !v)}
          />
        </div>
      )}

      {showExtras && balloons.length > 0 && (
        <div>
          <p className="mb-2 text-[13px] font-medium text-[#333]">Add balloons</p>
          <p className="mb-2 text-[12px] text-muted">Optional helium balloons — price confirmed on WhatsApp.</p>
          <AddonGrid
            items={balloons}
            selectedIds={extraIds}
            onToggle={toggleExtra}
            fallbackImg="/images/balloon.jpg"
            showMore={showMoreBalloons}
            onToggleMore={() => setShowMoreBalloons((v) => !v)}
          />
        </div>
      )}

      {!needsWhatsApp && (
        <p className="text-sm text-muted">
          Total with options: <strong className="text-ink">{formatNaira(total)}</strong>
        </p>
      )}
      {hasUnpricedExtras && !enquireOnly && (
        <p className="text-[13px] text-[#555]">
          You selected extras without a set price — continue on WhatsApp so we can confirm the total.
        </p>
      )}

      {needsWhatsApp ? (
        <a
          href={`https://wa.me/${wa}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 bg-black px-6 py-3.5 text-[14px] font-medium tracking-wide text-white hover:bg-[#222] sm:w-auto"
        >
          Enquire on WhatsApp
        </a>
      ) : (
        <button
          type="button"
          onClick={addToCart}
          className="inline-flex w-full items-center justify-center gap-2 bg-black px-6 py-3.5 text-[14px] font-medium tracking-wide text-white hover:bg-[#222] sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 7h15l-1.4 9H7.2L6 7z" />
            <path d="M6 7L5 3H2" />
          </svg>
          Add to cart
        </button>
      )}
    </div>
  );
}
