/* eslint-disable @next/next/no-img-element */

// Decorative spot illustrations (public/art/*.png) — warm watercolor accents.
// Always decorative (aria-hidden, empty alt); never load-bearing content.

export function Art({
  name,
  className = "",
}: {
  name: "letter" | "light" | "hands" | "bloom";
  className?: string;
}) {
  return (
    <img
      src={`/art/${name}.png`}
      alt=""
      aria-hidden
      className={`object-contain ${className}`}
    />
  );
}
