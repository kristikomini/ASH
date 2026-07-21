"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconGrid,
  IconInbox,
  IconLayers,
  IconCalendar,
  IconFile,
  IconExternal,
} from "./icons";
import { LEADS } from "@/lib/dashboard-data";

export const NAV = [
  { href: "/dashboard", label: "Panoramica", icon: <IconGrid /> },
  { href: "/dashboard/leads", label: "Richieste", icon: <IconInbox /> },
  { href: "/dashboard/progetti", label: "Progetti", icon: <IconLayers /> },
  { href: "/dashboard/calendario", label: "Calendario", icon: <IconCalendar /> },
  { href: "/dashboard/preventivi", label: "Preventivi", icon: <IconFile /> },
];

const newLeads = LEADS.filter((l) => l.status === "Nuovo").length;

export default function Sidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-charcoal-2 transition-transform duration-300 lg:static lg:z-auto lg:h-dvh lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-3 border-b border-line px-6 py-5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" aria-hidden className="h-8 w-auto" />
        <span className="leading-tight">
          <span className="block font-display text-lg font-bold tracking-arch text-cream">
            A.S.H.
          </span>
          <span className="block text-[0.6rem] uppercase tracking-[0.28em] text-gold">
            Dashboard
          </span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-slate text-cream"
                  : "text-cream-dim hover:bg-slate/50 hover:text-cream"
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold transition-opacity ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className={active ? "text-gold" : "text-cream-dim group-hover:text-cream"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.href === "/dashboard/leads" && newLeads > 0 && (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] font-semibold text-gold">
                  {newLeads}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer: user + back to site */}
      <div className="border-t border-line px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 font-display text-sm font-bold text-gold">
            AA
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm text-cream">Ahmed Abdelaziz</span>
            <span className="block text-xs text-cream-dim">Titolare</span>
          </span>
        </div>
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream-dim transition-colors hover:bg-slate/50 hover:text-cream"
        >
          <IconExternal className="h-5 w-5" />
          Torna al sito
        </Link>
      </div>
    </aside>
  );
}
