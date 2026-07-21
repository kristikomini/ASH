"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NAV } from "./Sidebar";
import { IconSearch, IconChevronRight } from "./icons";

const ACTIONS = [
  { label: "Nuova richiesta", hint: "Crea", href: "/dashboard/leads" },
  { label: "Vai al sito pubblico", hint: "Apri", href: "/" },
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("ash:cmdk", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ash:cmdk", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const items = [
    ...NAV.map((n) => ({ label: n.label, hint: "Vai", href: n.href })),
    ...ACTIONS,
  ].filter((i) => i.label.toLowerCase().includes(q.toLowerCase().trim()));

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(items.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[sel]) go(items[sel].href);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-charcoal/70 p-4 pt-[14vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Comandi rapidi"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-charcoal-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <IconSearch className="h-5 w-5 text-cream-dim" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Cerca o salta a…"
            className="w-full bg-transparent py-4 text-cream outline-none placeholder:text-cream-dim"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[0.65rem] text-cream-dim">
            ESC
          </kbd>
        </div>

        <ul className="max-h-72 overflow-auto p-2">
          {items.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-cream-dim">
              Nessun risultato
            </li>
          )}
          {items.map((it, i) => (
            <li key={it.href + it.label}>
              <button
                type="button"
                onMouseEnter={() => setSel(i)}
                onClick={() => go(it.href)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  i === sel ? "bg-slate text-cream" : "text-cream-dim"
                }`}
              >
                <IconChevronRight className={`h-4 w-4 ${i === sel ? "text-gold" : "text-cream-dim"}`} />
                <span className="flex-1">{it.label}</span>
                <span className="text-xs text-cream-dim">{it.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
