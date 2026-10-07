export const metadata = { title: "How to order" };

export default function HowToOrderPage() {
  const steps = [
    "Browse categories and choose your bouquet, set or arrangement.",
    "Select size, colour or rose count, then add to cart.",
    "Checkout with sender & recipient details for Lagos delivery.",
    "Pay securely online with Paystack.",
    "Approve the video we send via WhatsApp or email before delivery.",
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl">How to order flowers</h1>
      <ol className="mt-8 space-y-4">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-4 border-b border-line pb-4">
            <span className="font-display text-2xl text-magenta">{i + 1}</span>
            <p className="pt-1 text-muted">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
