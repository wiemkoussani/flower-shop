"use client";

import { useRef } from "react";

type Review = {
  id: string;
  authorName: string;
  title: string;
  body: string;
  rating: number;
};

const TIMES = [
  "3 hours ago",
  "5 hours ago",
  "8 hours ago",
  "19 hours ago",
  "1 day ago",
  "2 days ago",
  "3 days ago",
  "5 days ago",
  "1 week ago",
  "2 weeks ago",
];

function TpStars({ size = 18 }: { size?: number }) {
  return (
    <span className="tp-stars" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="tp-star" style={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} aria-hidden>
            <path
              fill="#fff"
              d="M12 2.5l2.6 6.6H22l-5.4 4.2 2.1 6.7L12 15.8 5.3 20l2.1-6.7L2 9.1h7.4z"
            />
          </svg>
        </span>
      ))}
    </span>
  );
}

/** Left column block — sits above the sticky sidebar (flowers.ae) */
export function ReviewsSummary({ total = 8817 }: { total?: number }) {
  return (
    <div className="reviews-summary">
      <p className="reviews-excellent">Excellent</p>
      <div className="mt-1.5">
        <TpStars size={20} />
      </div>
      <p className="mt-2 text-[12px] text-[#555]">
        Based on <span className="underline decoration-[#bbb]">{total.toLocaleString()}</span> reviews
      </p>
      <p className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#00b67a]">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2l2.4 7.2H22l-6 4.4 2.3 7L12 16.8 5.7 20.6 8 13.6 2 9.2h7.6z" />
        </svg>
        Trustpilot
      </p>
    </div>
  );
}

/** Right column carousel with circular prev/next */
export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 400, behavior: "smooth" });
  }

  return (
    <div>
      <div className="reviews-carousel">
        <button
          type="button"
          aria-label="Previous reviews"
          onClick={() => scrollBy(-1)}
          className="review-nav"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div ref={trackRef} className="reviews-track">
          {reviews.map((r, i) => (
            <article key={r.id} className="review-card" tabIndex={0}>
              <div className="flex items-center gap-2.5">
                <TpStars size={16} />
                <span className="inline-flex items-center gap-1 text-[11px] text-[#6b6b6b]">
                  <span className="verified-dot" aria-hidden>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#fff">
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                    </svg>
                  </span>
                  Verified
                </span>
              </div>
              <p className="review-card-meta">
                <span className="font-semibold text-ink">{r.authorName}</span>
                <span className="text-[#888]">, {TIMES[i % TIMES.length]}</span>
              </p>
              <p className="review-card-title">{r.title}</p>
              <p className="review-card-body">{r.body}</p>
            </article>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next reviews"
          onClick={() => scrollBy(1)}
          className="review-nav"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="mt-2 text-[11px] text-[#666]">Showing our 5 star reviews</p>
    </div>
  );
}

/** Legacy full-width strip (unused on home — kept for other pages if needed) */
export function ReviewsStrip({ reviews }: { reviews: Review[] }) {
  return (
    <section className="trust-bar">
      <div className="site-wrap">
        <div className="reviews-row">
          <ReviewsSummary />
          <div className="min-w-0 flex-1">
            <ReviewsCarousel reviews={reviews} />
          </div>
        </div>
      </div>
    </section>
  );
}
