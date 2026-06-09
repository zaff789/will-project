"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PrototypeBanner } from "./PrototypeBanner";
import { BottomNav } from "./BottomNav";
import { TimeMachine } from "./TimeMachine";
import { useWillStore, packageForUser } from "@/lib/store";
import { BRAND, PACKAGE_LABELS } from "@/lib/content";

// The authenticated app frame: permanent prototype banner, a quiet header with
// the current (mock) persona, the page, and bottom navigation. Mobile-first —
// content is held in a phone-width column so the prototype reads as a real app.

export function AppShell({ children }: { children: ReactNode }) {
  const { data, currentUserId } = useWillStore();
  const user = data.users.find((u) => u.id === currentUserId);
  const pkg = packageForUser(data, currentUserId);
  const initial = user?.full_name?.trim()?.[0] ?? "?";

  return (
    <div className="flex min-h-screen flex-col bg-paper lg:bg-[linear-gradient(180deg,#ece3d1_0%,#e5dbc7_100%)]">
      <PrototypeBanner />

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col lg:border-x lg:border-line lg:bg-paper lg:shadow-[0_0_80px_-26px_rgba(120,80,40,0.32)]">
        <header className="sticky top-[26px] z-30 border-b border-line bg-paper/85 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-3">
            <Link href="/app/dashboard" className="leading-tight">
              <span className="font-serif text-lg text-ink">{BRAND.marketName}</span>
              <span className="block text-[10px] text-muted">{BRAND.clarifier}</span>
            </Link>

            <Link
              href="/app/account"
              className="flex items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 hairline transition-colors hover:bg-surface-sunk"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-wash font-serif text-sm text-accent">
                {initial}
              </span>
              <span className="hidden text-xs text-ink-soft sm:inline">
                {pkg ? PACKAGE_LABELS[pkg.package_type] : ""}
              </span>
            </Link>
          </div>
        </header>

        <main className="w-full flex-1 px-5 pb-10 pt-6">{children}</main>

        <BottomNav />
      </div>

      <TimeMachine />
    </div>
  );
}
