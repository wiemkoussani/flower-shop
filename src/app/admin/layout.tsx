import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";

const LINKS = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Products"],
  ["/admin/addons", "Add-ons"],
  ["/admin/orders", "Orders"],
  ["/admin/reviews", "Reviews"],
  ["/admin/faqs", "FAQs"],
  ["/admin/settings", "Settings"],
  ["/admin/subscribers", "Subscribers"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdminAuthenticated();

  return (
    <div className="min-h-screen bg-[#f7f2ef] text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <Link href="/admin" className="font-display text-2xl tracking-wide">
              Flower Room Admin
            </Link>
            <p className="text-[11px] tracking-[0.14em] uppercase text-muted">Manage store</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted hover:text-magenta">
              View site
            </Link>
            {ok && (
              <form action="/api/admin/logout" method="post">
                <button type="submit" className="text-magenta hover:underline">
                  Logout
                </button>
              </form>
            )}
          </div>
        </div>
        {ok && (
          <nav className="border-t border-line bg-[#f3eee6]/80">
            <ul className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 py-3 text-xs tracking-[0.1em] uppercase">
              {LINKS.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-magenta whitespace-nowrap">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
