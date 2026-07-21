"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-charcoal lg:grid lg:grid-cols-[16rem_1fr]">
      {open && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <Sidebar open={open} onNavigate={() => setOpen(false)} />

      <div className="flex min-h-dvh flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>

      <CommandPalette />
    </div>
  );
}
