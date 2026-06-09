"use client";

import { useRef, useState } from "react";

// A press-and-hold confirmation. Gives a deliberate, weighted gesture to weighty
// moments (the onboarding "begin", later message sealing) without ceremony.
// Releases early → resets. Holds the full duration → onComplete(). Reduced-motion
// users get an instant click instead of a hold.
//
// Completion fires on a setTimeout (reliable even if rAF is throttled); rAF only
// drives the visual fill.

export function HoldToConfirm({
  label,
  holdingLabel,
  onComplete,
  durationMs = 1300,
  className = "",
}: {
  label: string;
  holdingLabel?: string;
  onComplete: () => void;
  durationMs?: number;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef(0);
  const done = useRef(false);

  function clearAll() {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (timer.current) clearTimeout(timer.current);
    raf.current = null;
    timer.current = null;
  }

  function begin() {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (reduce) {
      onComplete();
      return;
    }
    done.current = false;
    start.current = performance.now();

    // Reliable completion.
    timer.current = setTimeout(() => {
      done.current = true;
      setProgress(1);
      onComplete();
    }, durationMs);

    // Best-effort visual fill.
    const tick = (t: number) => {
      const p = Math.min(1, (t - start.current) / durationMs);
      setProgress(p);
      if (p < 1 && !done.current) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  function cancel() {
    clearAll();
    if (!done.current) setProgress(0);
  }

  const holding = progress > 0 && progress < 1;

  return (
    <button
      type="button"
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      className={`relative inline-flex select-none items-center justify-center overflow-hidden rounded-full bg-accent px-9 py-3.5 text-[15px] font-medium text-paper transition-colors duration-300 ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-[#7d5d33] transition-[width] duration-100 ease-linear"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative">
        {holding ? (holdingLabel ?? label) : label}
      </span>
    </button>
  );
}
