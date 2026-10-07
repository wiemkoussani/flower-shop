import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getSiteSettings } from "@/lib/settings";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1 bg-[#faf6ef]">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFab number={settings.whatsapp} />
    </>
  );
}
