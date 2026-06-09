"use client";

import Link from "next/link";
import { Card, SectionLabel, Pill } from "@/components/ui";
import { MeaningfulMessages } from "@/components/MeaningfulMessages";
import { Reveal } from "@/components/Reveal";
import {
  STATUS_LABELS,
  TRIGGER_LABELS,
  DELIVERY_LABELS,
  PACKAGE_LABELS,
  MICROCOPY,
} from "@/lib/content";
import {
  useWillStore,
  vaultsForUser,
  messagesForUser,
} from "@/lib/store";
import type { MessageStatus } from "@/lib/types";

// Vault dashboard (Slice 2) — the vault home: check-in status, vault summary,
// messages with live status, and recent activity (so the time-machine lifecycle
// has a home). Reflects the simulated release engine.

const ACTION_LABELS: Record<string, string> = {
  "message.sealed": "ปิดผนึกข้อความ",
  "message.released": "ปล่อยข้อความถึงผู้รับ",
  "message.opened": "ผู้รับเปิดข้อความ",
  "message.destroyed": "ข้อความถูกทำลาย",
  "checkin.responded": "ยืนยันการเช็คอิน",
};

function statusTone(s: MessageStatus): "neutral" | "calm" | "warn" | "accent" {
  if (s === "released") return "accent";
  if (s === "pending_release" || s === "scheduled" || s === "disputed") return "warn";
  if (s === "destroyed" || s === "draft" || s === "cancelled") return "neutral";
  return "calm";
}

export default function DashboardPage() {
  const { data, currentUserId, checkInNow } = useWillStore();
  const user = data.users.find((u) => u.id === currentUserId);
  const vaults = vaultsForUser(data, currentUserId);
  const messages = messagesForUser(data, currentUserId);
  const firstName = user?.full_name.split(" ")[0] ?? "";

  const myMsgIds = new Set(messages.map((m) => m.id));
  const inactivityTriggers = data.triggerRules.filter(
    (t) => t.trigger_type === "inactivity" && myMsgIds.has(t.message_id),
  );
  const lastCheckIn = data.checkIns
    .filter((c) => c.user_id === currentUserId && c.responded_at)
    .map((c) => c.responded_at as string)
    .sort()
    .pop();

  const recent = data.auditLogs
    .filter(
      (a) =>
        (a.entity_type === "Message" && myMsgIds.has(a.entity_id)) ||
        a.actor === currentUserId,
    )
    .slice()
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 6);

  function meta(messageId: string) {
    const mr = data.messageRecipients.find((x) => x.message_id === messageId);
    const recipient = data.recipients.find((r) => r.id === mr?.recipient_id);
    const tr = data.triggerRules.find((t) => t.message_id === messageId);
    return {
      recipient: recipient?.full_name ?? "—",
      trigger: tr ? TRIGGER_LABELS[tr.trigger_type] : "",
      delivery: mr ? DELIVERY_LABELS[mr.delivery_channel] ?? "" : "",
    };
  }

  function fmt(iso: string) {
    return new Date(iso).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>ยินดีต้อนรับกลับ</SectionLabel>
        <h1 className="mt-1.5 text-2xl text-ink">สวัสดี {firstName}</h1>
        <p className="mt-1 text-[15px] text-ink-soft">
          ทุกอย่างถูกเก็บไว้อย่างปลอดภัย และจะเปิดเมื่อถึงเวลาที่เหมาะสมเท่านั้น
        </p>
      </div>

      {/* Check-in status (only if the user has inactivity-triggered messages) */}
      {inactivityTriggers.length > 0 && (
        <Card className="border-l-2 border-l-accent p-5">
          <p className="font-medium text-ink">{MICROCOPY.checkIn.heading}</p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">
            {MICROCOPY.checkIn.body}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[12.5px] text-muted">
              {lastCheckIn ? `ยืนยันล่าสุด ${fmt(lastCheckIn)}` : "ยังไม่เคยยืนยัน"}
            </span>
            <button
              onClick={() => checkInNow(currentUserId)}
              className="rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-paper transition-colors hover:bg-[#946f3e]"
            >
              ยืนยันว่าสบายดี · I&rsquo;m here
            </button>
          </div>
        </Card>
      )}

      {/* Vaults */}
      <div>
        <SectionLabel>พื้นที่เก็บ · Vaults</SectionLabel>
        <div className="mt-3 space-y-2">
          {vaults.map((v) => {
            const count = messages.filter((m) => m.vault_id === v.id).length;
            return (
              <Card key={v.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-ink">{v.name}</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    {PACKAGE_LABELS[v.vault_type] ?? v.vault_type} · {count} ข้อความ
                  </p>
                </div>
                <span className="font-serif text-2xl text-ink">{count}</span>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div>
        <div className="flex items-center justify-between">
          <SectionLabel>ข้อความ · Messages</SectionLabel>
          <Link href="/app/messages" className="text-[13px] text-accent hover:underline">
            + เขียนใหม่
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {messages.map((m) => {
            const mm = meta(m.id);
            return (
              <Link key={m.id} href={`/open/${m.id}`} className="block">
                <Card className="p-4 transition-colors hover:bg-surface-sunk">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 truncate font-medium text-ink">
                      {m.title}
                    </p>
                    <Pill tone={statusTone(m.status)}>{STATUS_LABELS[m.status]}</Pill>
                  </div>
                  <p className="mt-1 truncate text-[12.5px] text-muted">
                    ถึง {mm.recipient} · {mm.trigger} · {mm.delivery}
                  </p>
                </Card>
              </Link>
            );
          })}
          {messages.length === 0 && (
            <Card className="p-6 text-center text-[15px] text-muted">
              ยังไม่มีข้อความ — เริ่มต้นด้วยการเขียนข้อความแรกของคุณ
            </Card>
          )}
        </div>
      </div>

      {/* Recent activity */}
      {recent.length > 0 && (
        <div>
          <SectionLabel>ความเคลื่อนไหวล่าสุด · Activity</SectionLabel>
          <Card className="mt-3 divide-y divide-line p-0">
            {recent.map((a) => {
              const msg =
                a.entity_type === "Message"
                  ? data.messages.find((m) => m.id === a.entity_id)
                  : undefined;
              return (
                <div key={a.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-[14px] text-ink">
                      {ACTION_LABELS[a.action] ?? a.action}
                    </p>
                    {msg && (
                      <p className="mt-0.5 truncate text-[12.5px] text-muted">
                        {msg.title}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-[12px] text-muted">
                    {fmt(a.created_at)}
                  </span>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* A quiet note of inspiration */}
      <Reveal>
        <SectionLabel>แรงบันดาลใจ · Inspiration</SectionLabel>
        <div className="mt-3">
          <MeaningfulMessages limit={1} />
        </div>
      </Reveal>

      <p className="pt-1 text-center text-[11px] text-muted">
        ใช้ Time Machine (มุมขวาล่าง) เพื่อจำลองเวลาและดูข้อความถูกปล่อยตามเงื่อนไข
      </p>
    </div>
  );
}
