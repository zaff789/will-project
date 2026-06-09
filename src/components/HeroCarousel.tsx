"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

// Slow cinematic cross-fade through the warm silhouette images (ref: CURRENT /
// Voronoi). Deliberately unhurried — no flashy transitions. Falls back to the
// warm-doorway atmosphere underneath if an image is missing (404 → transparent).
// Respects prefers-reduced-motion (holds on the first frame).

export function HeroCarousel({
  images,
  intervalMs = 6500,
  objectPosition = "center",
}: {
  images: string[];
  intervalMs?: number;
  objectPosition?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (reduce) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % images.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2200ms] ease-in-out motion-reduce:transition-none ${
            idx === active ? "kenburns" : ""
          }`}
          style={{
            opacity: idx === active ? 1 : 0,
            objectPosition,
          }}
        />
      ))}
    </div>
  );
}
