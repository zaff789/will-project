// Shared UI primitives for The Will. Kept deliberately small and calm so every
// screen inherits the same trust-tech + warmth language (DESIGN.md).

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: As = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
} & ComponentProps<"div">) {
  return (
    <As
      className={`rounded-lg bg-surface hairline shadow-[0_1px_2px_rgba(35,43,48,0.04)] ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
      {children}
    </p>
  );
}

type ButtonVariant = "primary" | "quiet" | "ghost" | "danger";

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper hover:bg-[#171d21] active:bg-[#11171a] border border-transparent",
  quiet:
    "bg-surface text-ink hairline hover:bg-surface-sunk",
  ghost: "bg-transparent text-ink-soft hover:text-ink",
  danger:
    "bg-transparent text-danger border border-danger/40 hover:bg-danger/5",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
} & ComponentProps<"button">) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[15px] font-medium transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${buttonStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[15px] font-medium transition-colors duration-300 ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "calm" | "warn" | "accent";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-surface-sunk text-ink-soft",
    calm: "bg-calm/10 text-calm",
    warn: "bg-warn/10 text-warn",
    accent: "bg-accent-wash text-accent",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
