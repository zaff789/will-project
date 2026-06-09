"use client";

import { useRef, useState } from "react";

// The sealing ritual — a futuristic vault/encryption flourish for the deliberate
// "seal" moment. As you hold: a ring closes, glyphs scramble into ciphertext, the
// accent glows. On completion the lock snaps shut and resolves to a sealed hash,
// then advances. Robust completion (setTimeout) + rAF visual; reduced-motion safe.

const HEX = "0123456789ABCDEF";

export function SealRitual({
  accent,
  onComplete,
  durationMs = 1700,
}: {
  accent: string;
  onComplete: () => void;
  durationMs?: number;
}) {
  const [progress, setProgress] = useState(0);
  const [sealed, setSealed] = useState(false);
  const [cipher, setCipher] = useState("· · · · · · · ·");
  const raf = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glyph = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = useRef(false);

  function clearAll() {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (timer.current) clearTimeout(timer.current);
    if (glyph.current) clearInterval(glyph.current);
    raf.current = timer.current = glyph.current = null;
  }

  function scramble() {
    let s = "";
    for (let i = 0; i < 12; i++) s += HEX[Math.floor(Math.random() * 16)];
    setCipher(s);
  }

  function finish() {
    if (done.current) return;
    done.current = true;
    clearAll();
    setProgress(1);
    setSealed(true);
    setCipher("◆ SEALED ◆");
    setTimeout(onComplete, 720);
  }

  function begin() {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    if (reduce) {
      finish();
      return;
    }
    done.current = false;
    const start = performance.now();
    glyph.current = setInterval(scramble, 70);
    timer.current = setTimeout(finish, durationMs);
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setProgress(p);
      if (p < 1 && !done.current) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  function cancel() {
    if (done.current) return;
    clearAll();
    setProgress(0);
    setCipher("· · · · · · · ·");
  }

  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onPointerDown={begin}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        aria-label="Hold to seal"
        className="relative h-44 w-44 select-none touch-none rounded-full outline-none"
      >
        {/* Dark vault disc with accent glow */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full transition-shadow duration-500"
          style={{
            background: `radial-gradient(circle at 50% 42%, ${accent}40, transparent 58%), radial-gradient(circle at 50% 55%, #1d1610, #110c08)`,
            boxShadow: sealed
              ? `0 0 0 1px ${accent}, 0 0 46px -6px ${accent}`
              : `0 0 0 1px rgba(255,255,255,0.06), inset 0 0 40px -10px ${accent}55`,
          }}
        />

        {sealed && (
          <span
            aria-hidden
            className="pulse-ring absolute inset-0 rounded-full"
            style={{ background: accent, opacity: 0.4 }}
          />
        )}

        {/* Progress ring */}
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 90ms linear" }}
          />
        </svg>

        {/* Center: lock + ciphertext */}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span
            className="transition-transform duration-300"
            style={{
              color: accent,
              transform: sealed ? "scale(1.12)" : "scale(1)",
            }}
          >
            {sealed ? <LockClosed /> : <LockOpen />}
          </span>
          <span
            className="font-mono text-[10px] tracking-[0.18em]"
            style={{
              color: accent,
              opacity: sealed ? 1 : 0.35 + progress * 0.6,
            }}
          >
            {cipher}
          </span>
        </span>
      </button>

      <p className="mt-6 font-serif text-lg text-ink">
        {sealed ? "ปิดผนึกแล้ว · Sealed" : "กดค้างเพื่อปิดผนึก · Hold to seal"}
      </p>
      <p className="mt-1 text-[12.5px] text-muted">
        {sealed
          ? "เข้ารหัสและเก็บไว้อย่างปลอดภัย"
          : "เข้ารหัสและปิดผนึกพื้นที่ของคุณ"}
      </p>
    </div>
  );
}

function LockOpen() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 7.5-1.8" />
    </svg>
  );
}
function LockClosed() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <circle cx="12" cy="15.2" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
