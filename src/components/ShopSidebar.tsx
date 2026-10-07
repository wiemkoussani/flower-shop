"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Cat = { name: string; slug: string };

type NavChild = { href: string; label: string; match?: { param: string; value: string } };
type NavLink = { type: "link"; href: string; label: string };
type NavGroup = {
  type: "group";
  id: string;
  label: string;
  children: NavChild[];
};
type NavItem = NavLink | NavGroup;

function buildNav(categories: Cat[]): NavItem[] {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const items: NavItem[] = [{ type: "link", href: "/shop", label: "Shop all" }];

  if (bySlug["hand-tied-bouquets"]) {
    items.push({
      type: "group",
      id: "bouquets",
      label: bySlug["hand-tied-bouquets"].name,
      children: [
        { href: "/shop/hand-tied-bouquets", label: "All Bouquets" },
        { href: "/product/roses", label: "Roses" },
        { href: "/product/pink-bouquet", label: "Pink" },
        { href: "/product/lilac-bouquet", label: "Lilac" },
        { href: "/product/tropical-bouquet", label: "Tropical" },
        { href: "/product/ivory-bouquet", label: "Ivory" },
        { href: "/product/royal-bleu-bouquet", label: "Royal Bleu" },
      ],
    });
  }

  items.push({
    type: "group",
    id: "occasion",
    label: "Shop by Occasion",
    children: [
      {
        href: "/shop/gift-sets?occasion=birthday",
        label: "Birthday",
        match: { param: "occasion", value: "birthday" },
      },
      {
        href: "/shop/gift-sets?occasion=anniversary",
        label: "Anniversary",
        match: { param: "occasion", value: "anniversary" },
      },
      {
        href: "/shop/gift-sets?occasion=congratulations",
        label: "Congratulations",
        match: { param: "occasion", value: "congratulations" },
      },
      {
        href: "/shop/gift-sets?occasion=apology",
        label: "Apology",
        match: { param: "occasion", value: "apology" },
      },
    ],
  });

  for (const slug of ["signature-arrangements", "events-bridal", "sweet-savoury", "plants"] as const) {
    const cat = bySlug[slug];
    if (!cat) continue;
    items.push({
      type: "link",
      href: `/shop/${cat.slug}`,
      label: slug === "sweet-savoury" ? "Add-ons" : cat.name,
    });
  }

  return items;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`shop-sidebar-chevron${open ? " is-open" : ""}`}
      width="10"
      height="6"
      viewBox="0 0 10 6"
      aria-hidden
    >
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function pathOnly(href: string) {
  return href.split("?")[0];
}

function isActivePath(pathname: string, href: string) {
  const path = pathOnly(href);
  return pathname === path || (path !== "/shop" && pathname.startsWith(path));
}

function isChildActive(pathname: string, searchParams: URLSearchParams, child: NavChild) {
  if (child.match) {
    return (
      isActivePath(pathname, child.href) &&
      searchParams.get(child.match.param) === child.match.value
    );
  }
  return isActivePath(pathname, child.href);
}

function ShopSidebarInner({ categories }: { categories: Cat[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const items = buildNav(categories);

  const initiallyOpen = items.reduce<Record<string, boolean>>((acc, item) => {
    if (item.type === "group") {
      acc[item.id] = item.children.some((c) => isChildActive(pathname, searchParams, c));
    }
    return acc;
  }, {});

  const [open, setOpen] = useState<Record<string, boolean>>(initiallyOpen);

  useEffect(() => {
    setOpen((prev) => {
      const next = { ...prev };
      for (const item of items) {
        if (item.type === "group" && item.children.some((c) => isChildActive(pathname, searchParams, c))) {
          next[item.id] = true;
        }
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reopen when route / query changes
  }, [pathname, searchParams]);

  return (
    <aside className="shop-sidebar">
      <ul className="shop-sidebar-list">
        {items.map((item) => {
          if (item.type === "link") {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href} className="shop-sidebar-item">
                <Link href={item.href} className={active ? "is-active" : undefined}>
                  {item.label}
                </Link>
              </li>
            );
          }

          const isOpen = Boolean(open[item.id]);
          return (
            <li
              key={item.id}
              className={`shop-sidebar-item shop-sidebar-item--group${isOpen ? " is-open" : ""}`}
            >
              <button
                type="button"
                className="shop-sidebar-toggle"
                aria-expanded={isOpen}
                onClick={() => setOpen((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
              >
                <span>{item.label}</span>
                <Chevron open={isOpen} />
              </button>
              {isOpen && (
                <ul className="shop-sidebar-sub">
                  {item.children.map((child) => {
                    const active = isChildActive(pathname, searchParams, child);
                    return (
                      <li key={`${item.id}-${child.label}`}>
                        <Link href={child.href} className={active ? "is-active" : undefined}>
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

/** Sidebar = categories + flowers.ae-style accordion dropdowns */
export function ShopSidebar({ categories }: { categories: Cat[] }) {
  return (
    <Suspense fallback={<aside className="shop-sidebar" aria-hidden />}>
      <ShopSidebarInner categories={categories} />
    </Suspense>
  );
}
