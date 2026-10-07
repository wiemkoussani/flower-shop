export const metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs tracking-[0.16em] uppercase text-magenta">Flower Room NG</p>
      <h1 className="font-display mt-2 text-4xl">About us</h1>
      <div className="mt-6 space-y-4 text-muted leading-relaxed">
        <p>
          At Flower Room NG we have the best fresh flowers in Nigeria — wholesale and retail. Our
          diverse collection of hand-tied bouquets, baskets, boxes and large arrangements will leave
          a long-lasting impression and add joy to your special moments.
        </p>
        <p>
          We also offer same-day delivery to all Lagos. Our florists have a complete range for all
          occasions — from birthdays and anniversaries to Just Because, Get Well Soon and Sympathy.
        </p>
        <p>
          Once arranged, your florist will send a video via WhatsApp or email for your approval before
          delivery.
        </p>
      </div>
    </div>
  );
}
