"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { MICROCOPY, SECURITY_HONESTY, VISIBILITY_LABELS } from "@/lib/content";
import { useWillStore } from "@/lib/store";

// Recipient experience (Slice 5) — secure link → viewer → self-destruct. The most
// emotionally important screen: no app chrome, slow reveal, dignified end state.
// OTP/identity is deferred (added in the real product) — the slot is marked below.

type Phase = "arrival" | "viewing" | "closed";

export default function OpenMessagePage() {
  const params = useParams();
  const id = String(params.id);
  const { data, simulatedNow, openMessage, destroyMessage } = useWillStore();

  const message = data.messages.find((m) => m.id === id);
  const mr = data.messageRecipients.find((x) => x.message_id === id);
  const recipient = data.recipients.find((r) => r.id === mr?.recipient_id);
  const sender = data.users.find((u) => u.id === message?.creator_id);

  const alreadyDestroyed = message?.status === "destroyed";
  const oneTimeish =
    message?.visibility_mode === "one_time" ||
    message?.visibility_mode === "self_destruct";

  const [phase, setPhase] = useState<Phase>(
    alreadyDestroyed ? "closed" : "arrival",
  );

  function open() {
    if (message) openMessage(message.id);
    setPhase("viewing");
  }
  function close() {
    if (oneTimeish && message) destroyMessage(message.id, "one-time open by recipient");
    setPhase("closed");
  }

  return (
    <div className="atmosphere grain flex min-h-screen flex-col">
      <PrototypeBanner />

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-12">
        {!message ? (
          <Quiet
            heading="ขอบคุณที่แวะมา"
            body="ลิงก์นี้ไม่มีข้อความที่เปิดได้ในขณะนี้"
          />
        ) : phase === "arrival" ? (
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-night-soft">
              {sender ? `จาก ${sender.full_name.split(" ")[0]}` : "A message"}
            </p>

            {oneTimeish ? (
              <>
                <h1 className="mt-6 font-display text-3xl font-light leading-snug text-night-ink sm:text-4xl">
                  {MICROCOPY.beforeOneTime.heading}
                </h1>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-night-soft">
                  {MICROCOPY.beforeOneTime.body}
                </p>
                <button
                  onClick={open}
                  className="mt-10 inline-flex items-center justify-center rounded-full bg-glow px-9 py-3.5 text-[15px] font-medium text-night transition-colors hover:bg-[#f0c489]"
                >
                  {MICROCOPY.beforeOneTime.confirm}
                </button>
              </>
            ) : (
              <>
                <h1 className="mt-6 font-display text-3xl font-light leading-snug text-night-ink sm:text-4xl">
                  มีข้อความถึงคุณ
                </h1>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-night-soft">
                  {recipient ? `${recipient.full_name} — ` : ""}เปิดเมื่อคุณพร้อม
                </p>
                <button
                  onClick={open}
                  className="mt-10 inline-flex items-center justify-center rounded-full bg-glow px-9 py-3.5 text-[15px] font-medium text-night transition-colors hover:bg-[#f0c489]"
                >
                  เปิดอ่านข้อความ
                </button>
              </>
            )}

            {/* Identity verification (OTP) slots in here in the real product. */}
            <p className="mt-8 text-[11px] text-night-soft/60">
              ในผลิตภัณฑ์จริง จะมีการยืนยันตัวตน (OTP) ก่อนเปิด
            </p>
          </div>
        ) : phase === "viewing" ? (
          <div className="motion-drawer">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7">
              {message.watermark_enabled && recipient && (
                <Watermark name={recipient.full_name} when={simulatedNow} />
              )}
              <p className="relative text-[11px] uppercase tracking-[0.2em] text-night-soft/80">
                {VISIBILITY_LABELS[message.visibility_mode]}
              </p>
              <h1 className="relative mt-3 font-display text-2xl font-light text-night-ink">
                {message.title}
              </h1>
              <p className="relative mt-5 whitespace-pre-wrap font-serif text-[18px] leading-relaxed text-night-ink/95">
                {message.body_preview}
              </p>
            </div>

            <p className="mt-4 text-center text-[12px] leading-relaxed text-night-soft/70">
              {SECURITY_HONESTY.th}
            </p>

            <div className="mt-7 flex justify-center">
              <button
                onClick={close}
                className="rounded-full border border-night-soft/30 px-8 py-3 text-[15px] text-night-ink transition-colors hover:border-night-soft/60"
              >
                {oneTimeish ? "ปิดข้อความ (จะไม่สามารถเปิดได้อีก)" : "ปิดข้อความ"}
              </button>
            </div>
          </div>
        ) : (
          // closed / destroyed — quiet, dignified. Never an error.
          <Quiet
            heading={oneTimeish || alreadyDestroyed ? "ดูแลช่วงเวลานี้ด้วยความเข้าใจ" : "คุณได้อ่านข้อความแล้ว"}
            body={
              oneTimeish || alreadyDestroyed
                ? MICROCOPY.afterSelfDestruct.body
                : "ข้อความนี้ยังเก็บไว้ให้คุณ เปิดอ่านได้อีกเมื่อต้องการ"
            }
            reopen={!oneTimeish && !alreadyDestroyed ? () => setPhase("viewing") : undefined}
          />
        )}
      </main>
    </div>
  );
}

function Quiet({
  heading,
  body,
  reopen,
}: {
  heading: string;
  body: string;
  reopen?: () => void;
}) {
  return (
    <div className="motion-drawer text-center">
      <span
        aria-hidden
        className="mx-auto mb-7 block h-2 w-2 rounded-full bg-glow/70"
      />
      <h1 className="font-display text-2xl font-light leading-snug text-night-ink">
        {heading}
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-night-soft">
        {body}
      </p>
      {reopen && (
        <button
          onClick={reopen}
          className="mt-7 text-[14px] text-night-soft underline-offset-4 hover:text-night-ink hover:underline"
        >
          เปิดอ่านอีกครั้ง
        </button>
      )}
    </div>
  );
}

function Watermark({ name, when }: { name: string; when: string }) {
  const stamp = `${name} · ${new Date(when).toLocaleDateString("th-TH")} · The Will`;
  const rows = Array.from({ length: 7 });
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-around opacity-[0.06]"
    >
      {rows.map((_, i) => (
        <p
          key={i}
          className="-rotate-[18deg] whitespace-nowrap text-center text-[13px] tracking-wide text-night-ink"
        >
          {stamp} · {stamp} · {stamp}
        </p>
      ))}
    </div>
  );
}
