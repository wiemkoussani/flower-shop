import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Flower Room NG | Fresh Flowers & Same-Day Delivery Lagos",
    template: "%s · Flower Room NG",
  },
  description:
    "At Flower Room NG we have the best fresh flowers in Nigeria — wholesale and retail. Hand-tied bouquets, baskets, boxes and same-day delivery to all Lagos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#faf6ef] text-ink">{children}</body>
    </html>
  );
}
