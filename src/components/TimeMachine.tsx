"use client";

import { useState } from "react";
import { useWillStore, messagesForUser } from "@/lib/store";
import { SEED_NOW } from "@/lib/seed";
import { TRIGGER_LABELS, STATUS_LABELS } from "@/lib/content";

// Time Machine (Slice 6) — an in-app demo control to fast-forward the simulated
// clock and watch triggers release messages. NOT part of the real product; this
// stands in for real time + the real release engine (ReleaseEngine is a stub).

const STEPS: [string, number][] = [
  ["+1 วัน", 1],
  ["+1 สัปดาห์", 7],
  ["+1 เดือน", 30],
  ["+1 ปี", 365],
];

export function TimeMachine() {
  const [open, setOpen] = useState(false);
  const {
    data,
    currentUserId,
    simulatedNow,
    advanceDays,
    setSimulatedNow,
    evaluateDue,
    fireRelease,
  } = useWillStore();

  const msgs = messagesForUser(data, currentUserId);
  const dateStr = new Date(simulatedNow).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function advance(days: number) {
    advanceDays(days);
    evaluateDue();
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Time machine"
        className="fixed bottom-[74px] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-[0_8px_24px_-8px_rgba(35,43,48,0.5)] transition-transform active:scale-95"
      >
        <ClockIcon />
      </button>

      {open && (
        <div className="fixed bottom-[134px] right-4 z-50 max-h-[68vh] w-[340px] max-w-[calc(100vw-2rem)] overflow-auto rounded-2xl bg-surface p-4 shadow-[0_24px_60px_-20px_rgba(35,43,48,0.45)] hairline">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-accent">
              Time Machine · จำลองเวลา
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-ink"
              aria-label="close"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-[11px] text-muted">
            เครื่องมือสาธิต — ไม่มีในผลิตภัณฑ์จริง
          </p>

          <p className="mt-3 font-serif text-lg text-ink">{dateStr}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STEPS.map(([label, d]) => (
              <button
                key={d}
                onClick={() => advance(d)}
                className="rounded-full bg-surface-sunk px-3 py-1.5 text-[12px] text-ink transition-colors hover:bg-line"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setSimulatedNow(SEED_NOW)}
              className="rounded-full px-3 py-1.5 text-[12px] text-muted transition-colors hover:text-ink"
            >
              รีเซ็ตเวลา
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {msgs.map((m) => {
              const tr = data.triggerRules.find((t) => t.message_id === m.id);
              const released = m.status === "released";
              const destroyed = m.status === "destroyed";
              const settled = released || destroyed;
              const manual =
                !!tr &&
                ["trusted_person", "death_verification"].includes(
                  tr.trigger_type,
                );
              return (
                <div key={m.id} className="rounded-lg bg-paper p-3 hairline">
                  <p className="truncate text-[13px] font-medium text-ink">
                    {m.title}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted">
                      {tr ? TRIGGER_LABELS[tr.trigger_type] : "—"} ·{" "}
                      {STATUS_LABELS[m.status]}
                    </span>
                    {settled ? (
                      <span className="text-[11px] text-calm">
                        {destroyed ? "ถูกทำลาย" : "ปล่อยแล้ว"}
                      </span>
                    ) : manual ? (
                      <button
                        onClick={() => fireRelease(m.id)}
                        className="shrink-0 rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-paper hover:bg-[#946f3e]"
                      >
                        ยืนยันและปล่อย
                      </button>
                    ) : (
                      <button
                        onClick={() => fireRelease(m.id)}
                        className="shrink-0 rounded-full bg-surface-sunk px-3 py-1 text-[11px] text-ink hover:bg-line"
                      >
                        ปล่อยตอนนี้
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {msgs.length === 0 && (
              <p className="text-[12px] text-muted">ยังไม่มีข้อความ</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
