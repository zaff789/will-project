"use client";

import type { Archetype } from "@/lib/archetypes";

// Futuristic-but-warm visualization of the conditional release pipeline:
// your message → encrypted & held → opens only when [your condition].
// The condition + accent adapt to the chosen intent. Motion = a data-flow pulse
// travelling the connectors + a soft glow on the secure node. Reduced-motion safe.

export function ReleaseFlow({ a }: { a: Archetype }) {
  const accent = a.accent;
  return (
    <div className="rounded-2xl bg-surface p-6 hairline shadow-[0_24px_60px_-34px_rgba(120,80,40,0.5)]">
      <Node
        icon={<PenIcon />}
        title="ข้อความของคุณ"
        sub="Your message"
        color={accent}
      />
      <Connector color={accent} />
      <Node
        icon={<LockIcon />}
        title="เข้ารหัสและเก็บอย่างปลอดภัย"
        sub="Encrypted & held"
        color={accent}
        glow
      />
      <Connector color={accent} />
      <Node
        icon={<KeyIcon />}
        title={`เปิดเมื่อ — ${a.conditionTh}`}
        sub={`Opens when — ${a.conditionEn}`}
        color={accent}
        highlight
      />

      <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-muted">
        ระบบช่วยลดความเสี่ยง แต่ไม่สามารถป้องกันการถ่ายภาพหน้าจอหรือบันทึกหน้าจอได้ทั้งหมด
        <span className="mt-0.5 block">
          {a.privacyTh}
        </span>
      </p>
    </div>
  );
}

function Node({
  icon,
  title,
  sub,
  color,
  glow,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  color: string;
  glow?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        {glow && (
          <span
            aria-hidden
            className="pulse-ring absolute inset-0 rounded-full"
            style={{ background: color, opacity: 0.4 }}
          />
        )}
        <span
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-paper"
          style={{ background: color }}
        >
          {icon}
        </span>
      </span>
      <span className="min-w-0">
        <span
          className="block text-[15px] font-medium"
          style={highlight ? { color } : { color: "var(--color-ink)" }}
        >
          {title}
        </span>
        <span className="block text-[12.5px] text-muted">{sub}</span>
      </span>
    </div>
  );
}

function Connector({ color }: { color: string }) {
  return (
    <div className="relative my-1 ml-[21px] h-9 w-px bg-line">
      <span
        aria-hidden
        className="flow-dot absolute -left-[1.5px] h-1 w-1 rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

function PenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="m10.5 12.5 9-9M17 6l2 2M14 9l1.5 1.5" />
    </svg>
  );
}
