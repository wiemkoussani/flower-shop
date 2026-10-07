import Link from "next/link";

export default function OrderFailedPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-xs tracking-[0.16em] uppercase text-magenta">Payment</p>
      <h1 className="font-display mt-2 text-4xl">Payment unsuccessful</h1>
      <p className="mt-4 text-muted">
        Something went wrong with the payment. You can try again from your cart, or message us on WhatsApp.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/cart" className="btn-primary">
          Back to cart
        </Link>
        <Link href="/shop" className="btn-ghost">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
