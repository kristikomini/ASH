"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "./Sidebar";
import { IconMenu, IconSearch, IconBell, IconPlus } from "./icons";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const current =
    NAV.find((n) =>
      n.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(n.href)
    )?.label ?? "Dashboard";

  const openPalette = () =>
    window.dispatchEvent(new CustomEvent("ash:cmdk"));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-charcoal/80 px-5 backdrop-blur-md md:px-8">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Apri menu"
        className="text-cream-dim transition-colors hover:text-cream lg:hidden"
      >
        <IconMenu />
      </button>

      <h1 className="hidden font-display text-lg font-medium tracking-tight text-cream md:block">
        {current}
      </h1>

      <button
        type="button"
        onClick={openPalette}
        className="ml-auto flex items-center gap-2 rounded-lg border border-line bg-slate/40 px-3 py-2 text-sm text-cream-dim transition-colors hover:border-gold/40 hover:text-cream md:ml-6 md:w-64"
      >
        <IconSearch className="h-4 w-4" />
        <span className="hidden md:inline">Cerca o salta a…</span>
        <kbd className="ml-auto hidden rounded border border-line px-1.5 py-0.5 text-[0.65rem] md:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 md:ml-4">
        <button
          type="button"
          aria-label="Notifiche"
          className="relative rounded-lg border border-line bg-slate/40 p-2 text-cream-dim transition-colors hover:text-cream"
        >
          <IconBell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
        </button>

        <Link
          href="/dashboard/leads"
          className="hidden items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-gold-light sm:inline-flex"
        >
          <IconPlus className="h-4 w-4" />
          Nuova richiesta
        </Link>
      </div>
    </header>
  );
}
