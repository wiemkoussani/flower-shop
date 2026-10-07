import { SHOP_ADDRESS, SHOP_MAPS_URL } from "@/lib/location";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE || "+234 915 535 3128";
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2349155353128";

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs tracking-[0.16em] uppercase text-magenta">Get in touch</p>
      <h1 className="font-display mt-2 text-4xl">Contact</h1>
      <p className="mt-4 text-muted">
        Questions about wholesale, events, or a custom arrangement? Reach us anytime.
      </p>
      <ul className="mt-8 space-y-3 text-ink">
        <li>
          Phone:{" "}
          <a className="text-magenta hover:underline" href={`tel:${phone.replace(/\s/g, "")}`}>
            {phone}
          </a>
        </li>
        <li>
          WhatsApp:{" "}
          <a
            className="text-magenta hover:underline"
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat with us
          </a>
        </li>
        <li>
          Location:{" "}
          <a
            className="text-magenta hover:underline"
            href={SHOP_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {SHOP_ADDRESS}
          </a>
        </li>
      </ul>
    </div>
  );
}
