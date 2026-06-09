// Permanent prototype banner. Per CLAUDE.md §2 this must NEVER be removed or
// hidden: the product is synthetic-data-only and must say so everywhere.

import { PROTOTYPE_BANNER } from "@/lib/content";

export function PrototypeBanner() {
  return (
    <div
      role="note"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-ink px-4 py-1.5 text-center text-[11px] font-medium tracking-wide text-paper/85"
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-accent-soft"
      />
      {PROTOTYPE_BANNER}
    </div>
  );
}
