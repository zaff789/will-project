"use client";

import { useEffect, useState } from "react";
import { QUOTES } from "@/lib/examples";

// A small emotional gimmick: heartfelt one-liners that slowly cross-fade.
// Reduced-motion holds on the first line.

export function RotatingQuote({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (reduce) return;
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setI((p) => (p + 1) % QUOTES.length);
        setShow(true);
      }, 600);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const q = QUOTES[i];
  return (
    <div
      className={`transition-opacity duration-[600ms] ${show ? "opacity-100" : "opacity-0"} ${className}`}
    >
      <p className="font-serif text-lg text-ink">{q.th}</p>
      <p className="mt-0.5 text-[13px] text-muted">{q.en}</p>
    </div>
  );
}
