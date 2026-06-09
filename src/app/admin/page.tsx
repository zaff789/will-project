"use client";

import Link from "next/link";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { Card, SectionLabel, Pill } from "@/components/ui";
import {
  CATEGORY_LABELS,
  VISIBILITY_LABELS,
  TRIGGER_LABELS,
  STATUS_LABELS,
} from "@/lib/content";
import { useWillStore } from "@/lib/store";
import { AuditService } from "@/lib/stubs";

// Admin (Slice 7) — operator view, METADATA ONLY. By design the platform cannot
// read message content: no titles, no bodies, no recipient names here — only the
// trust workflow (verification queue, release log) and the audit trail. This is
// the boundary that makes The Will distributable to regulated partners.

const TYPE_LABELS: Record<string, string> = {
  text: "ข้อความ",
  audio: "เสียง",
  video: "วิดีโอ",
  file: "ไฟล์",
  mixed: "ผสม",
};

const AUDIT_LABELS: Record<string, string> = {
  "message.sealed": "ปิดผนึกข้อความ",
  "message.released": "ปล่อยข้อความ",
  "message.opened": "ผู้รับเปิดข้อความ",
  "message.destroyed": "ทำลายข้อความ",
  "checkin.responded": "เช็คอิน",
  "release.held": "พักการปล่อย (admin hold)",
};

export default function AdminPage() {
  const { data, fireRelease, holdTrigger } = useWillStore();

  const total = data.messages.length;
  const released = data.messages.filter((m) => m.status === "released").length;
  const destroyed = data.messages.filter((m) => m.status === "destroyed").length;

  const queue = data.triggerRules.filter((t) => {
    const m = data.messages.find((x) => x.id === t.message_id);
    return (
      ["trusted_person", "death_verification"].includes(t.trigger_type) &&
      m &&
      m.status !== "released" &&
      m.status !== "destroyed" &&
      t.status !== "fired"
    );
  });

  const settled = data.messages
    .filter((m) => m.released_at || m.destroyed_at)
    .sort((a, b) =>
      (b.released_at ?? b.destroyed_at ?? "") <
      (a.released_at ?? a.destroyed_at ?? "")
        ? -1
        : 1,
    );

  const audit = data.auditLogs.slice().reverse().slice(0, 14);

  function shortId(id: string) {
    return `#${id.slice(0, 8)}`;
  }
  function fmt(iso: string) {
    return new Date(iso).toLocaleString("th-TH", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  function metaLine(messageId: string) {
    const m = data.messages.find((x) => x.id === messageId);
    if (!m) return "";
    const recips = data.messageRecipients.filter(
      (x) => x.message_id === messageId,
    ).length;
    return `${CATEGORY_LABELS[m.message_category] ?? m.message_category} · ${TYPE_LABELS[m.message_type]} · ${VISIBILITY_LABELS[m.visibility_mode]} · ผู้รับ ${recips}`;
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PrototypeBanner />

      <header className="mx-auto w-full max-w-3xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
              Admin · Operator
            </p>
            <h1 className="mt-1 text-2xl text-ink">มุมมองผู้ดูแลระบบ</h1>
          </div>
          <Link href="/" className="text-[13px] text-muted hover:text-ink">
            ออกจากระบบ
          </Link>
        </div>
        <div className="mt-3 flex items-start gap-2.5 rounded-lg bg-surface-sunk px-4 py-2.5 text-[12.5px] text-ink-soft">
          <svg className="mt-0.5 shrink-0 text-accent" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
          </svg>
          <span>
            ผู้ดูแลเห็นเฉพาะ <b className="text-ink">ข้อมูลกำกับ</b> เท่านั้น —
            ไม่เห็นชื่อหรือเนื้อหาข้อความ (admins see metadata only, never content)
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl space-y-7 px-6 pb-16">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <Metric n={total} label="ข้อความ" />
          <Metric n={queue.length} label="รอตรวจสอบ" tone="warn" />
          <Metric n={released} label="ปล่อยแล้ว" />
          <Metric n={destroyed} label="ถูกทำลาย" />
        </div>

        {/* Verification queue */}
        <section>
          <SectionLabel>คิวตรวจสอบ · Verification queue</SectionLabel>
          <p className="mt-1 text-[12.5px] text-muted">
            เคสที่ต้องยืนยันก่อนปล่อย (ผู้ที่ไว้วางใจ / การเสียชีวิต) — ตัดสินบนข้อมูลกำกับ
          </p>
          <div className="mt-3 space-y-2">
            {queue.map((t) => (
              <Card key={t.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[13px] text-ink">
                      {shortId(t.message_id)}
                    </p>
                    <p className="mt-0.5 truncate text-[12.5px] text-muted">
                      {metaLine(t.message_id)}
                    </p>
                  </div>
                  <Pill tone={t.status === "held" ? "neutral" : "warn"}>
                    {t.status === "held" ? "พักไว้" : TRIGGER_LABELS[t.trigger_type]}
                  </Pill>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => fireRelease(t.message_id)}
                    className="rounded-full bg-accent px-4 py-1.5 text-[12.5px] font-medium text-paper hover:bg-[#946f3e]"
                  >
                    อนุมัติและปล่อย
                  </button>
                  {t.status !== "held" && (
                    <button
                      onClick={() => holdTrigger(t.message_id)}
                      className="rounded-full border border-line px-4 py-1.5 text-[12.5px] text-ink hover:bg-surface-sunk"
                    >
                      พักไว้ (hold)
                    </button>
                  )}
                  <span className="ml-auto text-[11.5px] text-muted">
                    ต้องยืนยัน {t.required_confirmations} · พัก {t.cooling_period_days} วัน
                  </span>
                </div>
              </Card>
            ))}
            {queue.length === 0 && (
              <Card className="p-5 text-center text-[14px] text-muted">
                ไม่มีเคสที่รอตรวจสอบ
              </Card>
            )}
          </div>
        </section>

        {/* Release log */}
        <section>
          <SectionLabel>บันทึกการปล่อย · Release log</SectionLabel>
          <Card className="mt-3 divide-y divide-line p-0">
            {settled.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-mono text-[13px] text-ink">{shortId(m.id)}</p>
                  <p className="mt-0.5 truncate text-[12px] text-muted">
                    {metaLine(m.id)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Pill tone={m.status === "destroyed" ? "neutral" : "accent"}>
                    {STATUS_LABELS[m.status]}
                  </Pill>
                  <p className="mt-1 text-[11px] text-muted">
                    {fmt(m.destroyed_at ?? m.released_at ?? m.sealed_at ?? m.created_at)}
                  </p>
                </div>
              </div>
            ))}
            {settled.length === 0 && (
              <p className="p-5 text-center text-[14px] text-muted">
                ยังไม่มีการปล่อยหรือทำลาย
              </p>
            )}
          </Card>
        </section>

        {/* Audit trail */}
        <section>
          <SectionLabel>บันทึกตรวจสอบ · Audit trail</SectionLabel>
          <Card className="mt-3 divide-y divide-line p-0">
            {audit.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 p-3.5">
                <div className="min-w-0">
                  <p className="text-[13.5px] text-ink">
                    {AUDIT_LABELS[a.action] ?? a.action}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
                    {a.actor} → {a.entity_type} {shortId(a.entity_id)}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] text-muted">
                  {fmt(a.created_at)}
                </span>
              </div>
            ))}
          </Card>
          <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
            {AuditService.describe()}
          </p>
        </section>
      </main>
    </div>
  );
}

function Metric({
  n,
  label,
  tone,
}: {
  n: number;
  label: string;
  tone?: "warn";
}) {
  return (
    <Card className="p-3 text-center">
      <p
        className={`font-serif text-2xl ${tone === "warn" && n > 0 ? "text-warn" : "text-ink"}`}
      >
        {n}
      </p>
      <p className="mt-0.5 text-[11.5px] leading-tight text-muted">{label}</p>
    </Card>
  );
}
