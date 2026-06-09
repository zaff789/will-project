/* eslint-disable @next/next/no-img-element */

import { EXAMPLE_MESSAGES } from "@/lib/examples";
import { Reveal } from "./Reveal";

// A warm grid of heartfelt example messages — photo of a person + a meaningful
// note. Emotional inspiration; clearly illustrative (synthetic), labelled as such
// by the caller's heading.

export function MeaningfulMessages({ limit = 3 }: { limit?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {EXAMPLE_MESSAGES.slice(0, limit).map((m, i) => (
        <Reveal key={m.toEn} delay={i * 120}>
        <figure
          className="overflow-hidden rounded-2xl bg-surface hairline shadow-[0_18px_44px_-26px_rgba(120,80,40,0.45)]"
        >
          <div className="relative aspect-[5/4] overflow-hidden">
            <img
              src={m.photo}
              alt=""
              aria-hidden
              className="kenburns-loop h-full w-full object-cover"
              style={{ objectPosition: "50% 26%" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, rgba(20,12,8,0.28) 0%, transparent 46%)",
              }}
            />
          </div>
          <figcaption className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
              {m.to} · {m.toEn}
            </p>
            <blockquote className="mt-2 font-serif text-[18px] leading-relaxed text-ink">
              “{m.quote}”
            </blockquote>
            <p className="mt-1.5 text-[13px] leading-snug text-muted">
              {m.quoteEn}
            </p>
          </figcaption>
        </figure>
        </Reveal>
      ))}
    </div>
  );
}
