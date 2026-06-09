"use client";

import { useState } from "react";
import { Card, SectionLabel, Pill } from "@/components/ui";
import { TRUSTED_ROLE_LABELS } from "@/lib/content";
import { useWillStore } from "@/lib/store";
import type { TrustedPersonRole } from "@/lib/types";

// Recipients & trusted persons (Slice 4) — the "who" home. Recipients = who can
// open messages; trusted persons = confirmers/emergency contacts/witnesses the
// release engine relies on. Add/remove; synthetic data only.

const ROLES: TrustedPersonRole[] = [
  "confirmer",
  "emergency_contact",
  "witness",
  "lawyer",
  "accountant",
  "advisor",
];

const VERIFY_LABELS: Record<string, string> = {
  verified: "ยืนยันแล้ว",
  pending: "รอยืนยัน",
  submitted: "ส่งแล้ว",
  rejected: "ปฏิเสธ",
  none: "—",
};

export default function RecipientsPage() {
  const {
    data,
    currentUserId,
    addRecipient,
    removeRecipient,
    addTrustedPerson,
    removeTrustedPerson,
  } = useWillStore();

  const recipients = data.recipients.filter((r) => r.owner_id === currentUserId);
  const trusted = data.trustedPersons.filter((t) => t.owner_id === currentUserId);

  const [tab, setTab] = useState<"recipients" | "trusted">("recipients");

  const [addR, setAddR] = useState(false);
  const [rName, setRName] = useState("");
  const [rContact, setRContact] = useState("");
  const [rRel, setRRel] = useState("");

  const [addT, setAddT] = useState(false);
  const [tName, setTName] = useState("");
  const [tContact, setTContact] = useState("");
  const [tRole, setTRole] = useState<TrustedPersonRole>("confirmer");

  function saveR() {
    if (!rName.trim() || !rContact.trim()) return;
    addRecipient({
      ownerId: currentUserId,
      fullName: rName.trim(),
      contact: rContact.trim(),
      relationship: rRel.trim() || "ผู้รับ",
    });
    setAddR(false);
    setRName("");
    setRContact("");
    setRRel("");
  }
  function saveT() {
    if (!tName.trim() || !tContact.trim()) return;
    addTrustedPerson({
      ownerId: currentUserId,
      fullName: tName.trim(),
      contact: tContact.trim(),
      role: tRole,
    });
    setAddT(false);
    setTName("");
    setTContact("");
    setTRole("confirmer");
  }

  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>ผู้คน · People</SectionLabel>
        <h1 className="mt-1.5 text-2xl text-ink">ผู้รับและผู้ที่ไว้วางใจ</h1>
      </div>

      <div className="flex gap-1 rounded-full bg-surface-sunk p-1">
        <TabBtn active={tab === "recipients"} onClick={() => setTab("recipients")}>
          ผู้รับ ({recipients.length})
        </TabBtn>
        <TabBtn active={tab === "trusted"} onClick={() => setTab("trusted")}>
          ผู้ที่ไว้วางใจ ({trusted.length})
        </TabBtn>
      </div>

      {tab === "recipients" ? (
        <div className="space-y-2">
          <p className="text-[13px] leading-relaxed text-muted">
            คนที่สามารถเปิดอ่านข้อความของคุณได้ เมื่อถึงเงื่อนไขที่กำหนด
          </p>
          {recipients.map((r) => (
            <Card key={r.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-ink">{r.full_name}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted">
                  {r.relationship} · {r.email || r.phone}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {r.identity_required && <Pill tone="neutral">OTP</Pill>}
                <RemoveBtn onClick={() => removeRecipient(r.id)} />
              </div>
            </Card>
          ))}

          {addR ? (
            <AddForm
              fields={[
                ["ชื่อผู้รับ · Their name", rName, setRName],
                ["อีเมลหรือเบอร์โทร · Email or phone", rContact, setRContact],
                ["ความสัมพันธ์ (เช่น ลูก เพื่อน)", rRel, setRRel],
              ]}
              canSave={!!rName.trim() && !!rContact.trim()}
              onSave={saveR}
              onCancel={() => setAddR(false)}
            />
          ) : (
            <AddTrigger label="เพิ่มผู้รับ · Add recipient" onClick={() => setAddR(true)} />
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-[13px] leading-relaxed text-muted">
            คนที่ช่วยยืนยันเหตุการณ์ หรือส่งต่อข้อความให้ — ระบบการปล่อยข้อความพึ่งพาคนเหล่านี้
          </p>
          {trusted.map((t) => (
            <Card key={t.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-ink">{t.full_name}</p>
                <p className="mt-0.5 truncate text-[13px] text-muted">
                  {TRUSTED_ROLE_LABELS[t.role] ?? t.role} · {t.contact}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Pill tone={t.verification_status === "verified" ? "calm" : "warn"}>
                  {VERIFY_LABELS[t.verification_status] ?? t.verification_status}
                </Pill>
                <RemoveBtn onClick={() => removeTrustedPerson(t.id)} />
              </div>
            </Card>
          ))}

          {addT ? (
            <Card className="space-y-3 p-4">
              <input
                autoFocus
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                placeholder="ชื่อ · Name"
                className="w-full border-b border-line bg-transparent pb-1.5 text-[15px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
              />
              <input
                value={tContact}
                onChange={(e) => setTContact(e.target.value)}
                placeholder="ช่องทางติดต่อ · Contact"
                className="w-full border-b border-line bg-transparent pb-1.5 text-[15px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
              />
              <select
                value={tRole}
                onChange={(e) => setTRole(e.target.value as TrustedPersonRole)}
                className="w-full rounded-lg bg-surface-sunk p-2.5 text-[14px] text-ink outline-none"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {TRUSTED_ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={saveT}
                  disabled={!tName.trim() || !tContact.trim()}
                  className="rounded-full bg-accent px-5 py-2 text-[14px] font-medium text-paper hover:bg-[#946f3e] disabled:opacity-40"
                >
                  บันทึก · Save
                </button>
                <button
                  onClick={() => setAddT(false)}
                  className="px-3 py-2 text-[14px] text-muted hover:text-ink"
                >
                  ยกเลิก
                </button>
              </div>
            </Card>
          ) : (
            <AddTrigger
              label="เพิ่มผู้ที่ไว้วางใจ · Add trusted person"
              onClick={() => setAddT(true)}
            />
          )}
        </div>
      )}

      <p className="pt-1 text-center text-[11px] text-muted">
        ข้อมูลทดสอบเท่านั้น · ไม่มีการส่งอีเมลหรือ SMS จริง
      </p>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full py-2 text-[13.5px] font-medium transition-colors ${
        active ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="remove"
      className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
    >
      ✕
    </button>
  );
}

function AddTrigger({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg border border-dashed border-line p-4 text-left text-[14px] text-ink-soft transition-colors hover:bg-surface"
    >
      <span className="text-lg leading-none text-accent">+</span>
      {label}
    </button>
  );
}

function AddForm({
  fields,
  canSave,
  onSave,
  onCancel,
}: {
  fields: [string, string, (v: string) => void][];
  canSave: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <Card className="space-y-3 p-4">
      {fields.map(([ph, val, set], i) => (
        <input
          key={ph}
          autoFocus={i === 0}
          value={val}
          onChange={(e) => set(e.target.value)}
          placeholder={ph}
          className="w-full border-b border-line bg-transparent pb-1.5 text-[15px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
        />
      ))}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={!canSave}
          className="rounded-full bg-accent px-5 py-2 text-[14px] font-medium text-paper hover:bg-[#946f3e] disabled:opacity-40"
        >
          บันทึก · Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 text-[14px] text-muted hover:text-ink"
        >
          ยกเลิก
        </button>
      </div>
    </Card>
  );
}
