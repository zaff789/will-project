"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Soft fade-up reveal as content scrolls into view. Robust by design: reveals
// immediately if already on-screen, via IntersectionObserver when scrolled to,
// and a safety timeout so content can NEVER stay hidden if the observer fails
// (headless browsers, odd environments). Reduced-motion → shown at once.

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (reduce) {
      setInView(true);
      return;
    }

    // Already on (or near) screen at mount → reveal now.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      setInView(true);
      return;
    }

    const ob = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          ob.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    ob.observe(el);

    // Safety net: never leave content hidden.
    const fallback = setTimeout(() => setInView(true), 2200);

    return () => {
      ob.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={inView ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
