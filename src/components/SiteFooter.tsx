import Link from "next/link";
import { BRAND } from "@/lib/content";

// Site footer for public pages (landing, stories) — closes the page with brand,
// the load-bearing not-a-legal-will line, navigation, and the prototype notice.

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl text-ink">The Will</p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {BRAND.clarifier}
            </p>
          </div>
          <nav className="flex flex-col gap-2.5 text-[14px]">
            <Link href="/stories" className="text-ink-soft transition-colors hover:text-ink">
              เรื่องราว · Stories
            </Link>
            <Link href="/onboarding" className="text-ink-soft transition-colors hover:text-ink">
              เริ่มต้น · Begin
            </Link>
            <Link href="/signin" className="text-ink-soft transition-colors hover:text-ink">
              เข้าสู่ระบบ · Sign in
            </Link>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>The Will — ไม่ใช่พินัยกรรมตามกฎหมาย · not a legally executed will</span>
          <span>PROTOTYPE — ข้อมูลทดสอบเท่านั้น (synthetic data only)</span>
        </div>
      </div>
    </footer>
  );
}
