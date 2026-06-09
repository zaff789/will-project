"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, SectionLabel } from "@/components/ui";
import { Art } from "@/components/Art";
import { SealRitual } from "@/components/SealRitual";
import {
  DISCLAIMER,
  MICROCOPY,
  SECURITY_HONESTY,
  VISIBILITY_LABELS,
  TRIGGER_LABELS,
  DELIVERY_LABELS,
  TRUSTED_ROLE_LABELS,
} from "@/lib/content";
import {
  useWillStore,
  vaultsForUser,
  packageForUser,
} from "@/lib/store";
import { TEMPLATES, type MessageTemplate } from "@/lib/templates";
import { PACKAGE_LABELS } from "@/lib/content";
import type {
  MessageType,
  MessageCategory,
  VisibilityMode,
  TriggerType,
  DeliveryChannel,
} from "@/lib/types";

// Message creation — the 6 dimensions (Slice 3): content → recipient → trigger →
// privacy/destruction → SEAL (the vault ritual) → done. Encryption is STUBBED.

const STEPS = ["start", "content", "recipient", "trigger", "privacy", "seal", "done"] as const;

const FORMAT_TH: Record<string, string> = {
  text: "เขียน",
  audio: "เสียง",
  video: "วิดีโอ",
  file: "ไฟล์",
  mixed: "ผสม",
};

const FORMATS: { id: MessageType; th: string; icon: React.ReactNode }[] = [
  { id: "text", th: "เขียน", icon: <PenIcon /> },
  { id: "audio", th: "เสียง", icon: <MicIcon /> },
  { id: "video", th: "วิดีโอ", icon: <VideoIcon /> },
  { id: "file", th: "ไฟล์", icon: <FileIcon /> },
];

const TRIGGERS: TriggerType[] = [
  "date",
  "inactivity",
  "trusted_person",
  "death_verification",
];

const VISIBILITIES: VisibilityMode[] = [
  "recipient_only",
  "one_time",
  "self_destruct",
];

const CHANNELS: { id: DeliveryChannel; th: string; en: string; note: string }[] = [
  { id: "secure_link", th: "ลิงก์ปลอดภัย (อีเมล/SMS)", en: "Secure link", note: "ส่งลิงก์ + รหัส OTP ทางอีเมลหรือ SMS เปิดได้ทันที" },
  { id: "postal", th: "จดหมายจริง — ไปรษณีย์ไทย", en: "Physical letter", note: "ส่งจดหมายพร้อมรหัสเข้าถึง น่าเชื่อถือ เหมาะกับผู้สูงอายุ" },
  { id: "trusted_relay", th: "ผ่านผู้ที่ไว้วางใจ", en: "Via a trusted person", note: "ให้คนที่ไว้ใจส่งต่อให้ด้วยตนเอง" },
];

export default function CreateMessagePage() {
  const router = useRouter();
  const { data, currentUserId, createMessage, addRecipient } = useWillStore();
  const vault = vaultsForUser(data, currentUserId)[0];
  const recipients = data.recipients.filter((r) => r.owner_id === currentUserId);
  const trustedPersons = data.trustedPersons.filter(
    (t) => t.owner_id === currentUserId,
  );
  const segment = packageForUser(data, currentUserId)?.package_type ?? "personal";
  const templates = TEMPLATES.filter((t) => t.pkg === segment);

  const [step, setStep] = useState(0);
  const [format, setFormat] = useState<MessageType>("text");
  const [category, setCategory] = useState<MessageCategory>("memory");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [addingRecipient, setAddingRecipient] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newRel, setNewRel] = useState("");
  const [deliveryChannel, setDeliveryChannel] =
    useState<DeliveryChannel>("secure_link");
  const [postalAddress, setPostalAddress] = useState("");
  const [relayPersonId, setRelayPersonId] = useState<string | null>(null);
  const [triggerType, setTriggerType] = useState<TriggerType>("date");
  const [releaseDate, setReleaseDate] = useState("");
  const [visibility, setVisibility] = useState<VisibilityMode>("recipient_only");
  const [watermark, setWatermark] = useState(true);
  const [allowDownload, setAllowDownload] = useState(false);
  const [identityRequired, setIdentityRequired] = useState(true);
  const [newId, setNewId] = useState<string | null>(null);

  const key = STEPS[step];
  const progress = step / (STEPS.length - 1);

  const sealAccent =
    visibility === "self_destruct"
      ? "#8f4f43"
      : visibility === "one_time"
        ? "#9a6a3c"
        : "#a9824c";

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function applyTemplate(t: MessageTemplate) {
    setFormat(t.format);
    setCategory(t.category);
    setTitle(t.titleTh);
    setVisibility(t.visibility);
    setTriggerType(t.trigger);
    next();
  }

  function seal() {
    const id = createMessage({
      vaultId: vault?.id ?? "v_anan",
      creatorId: currentUserId,
      title,
      body,
      format,
      category,
      recipientId,
      deliveryChannel,
      relayPersonId: deliveryChannel === "trusted_relay" ? relayPersonId : null,
      triggerType,
      releaseDatetime:
        triggerType === "date" && releaseDate
          ? new Date(releaseDate).toISOString()
          : null,
      visibility,
      watermark,
      allowDownload,
      identityRequired,
    });
    setNewId(id);
    next(); // → done
  }

  function saveNewRecipient() {
    if (!newName.trim() || !newContact.trim()) return;
    const id = addRecipient({
      ownerId: currentUserId,
      fullName: newName.trim(),
      contact: newContact.trim(),
      relationship: newRel.trim() || "ผู้รับ",
    });
    setRecipientId(id);
    setAddingRecipient(false);
    setNewName("");
    setNewContact("");
    setNewRel("");
  }

  function reset() {
    setStep(0);
    setCategory("memory");
    setTitle("");
    setBody("");
    setRecipientId(null);
    setDeliveryChannel("secure_link");
    setPostalAddress("");
    setRelayPersonId(null);
    setTriggerType("date");
    setReleaseDate("");
    setVisibility("recipient_only");
  }

  return (
    <div className="space-y-6">
      {/* Progress + back (hidden on done) */}
      {key !== "done" && (
        <div className="flex items-center gap-4">
          {step > 0 ? (
            <button
              onClick={back}
              className="text-[13px] text-muted transition-colors hover:text-ink-soft"
            >
              ← ย้อนกลับ
            </button>
          ) : (
            <span className="text-[13px] text-muted">ข้อความใหม่</span>
          )}
          <div className="h-px flex-1 bg-line">
            <div
              className="h-px bg-accent transition-all duration-500"
              style={{ width: `${Math.max(progress, 0.05) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* START — template gallery (per package) */}
      {key === "start" && (
        <div>
          <SectionLabel>เริ่มต้น · Start</SectionLabel>
          <h1 className="mt-1.5 text-2xl text-ink">เริ่มจากแม่แบบ</h1>
          <p className="mt-1 text-[14px] text-ink-soft">
            แม่แบบสำหรับ{" "}
            <span className="text-accent">{PACKAGE_LABELS[segment]}</span> —
            ตั้งค่าให้พร้อม แล้วปรับได้ตามใจ
          </p>

          <div className="mt-5 space-y-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t)}
                className="block w-full rounded-lg bg-surface p-4 text-left transition-colors hairline hover:bg-surface-sunk"
              >
                <span className="font-medium text-ink">{t.titleTh}</span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {t.descTh}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  <Pill>{FORMAT_TH[t.format]}</Pill>
                  <Pill>{TRIGGER_LABELS[t.trigger]}</Pill>
                  <Pill>{VISIBILITY_LABELS[t.visibility]}</Pill>
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={next}
            className="mt-3 flex w-full items-center gap-2 rounded-lg border border-dashed border-line p-4 text-left text-[14px] text-ink-soft transition-colors hover:bg-surface"
          >
            <span className="text-lg leading-none text-accent">+</span>
            เริ่มจากศูนย์ · Start blank
          </button>
        </div>
      )}

      {/* CONTENT */}
      {key === "content" && (
        <div>
          <SectionLabel>1 · เนื้อหา · Content</SectionLabel>
          <h1 className="mt-1.5 text-2xl text-ink">คุณอยากบอกอะไร</h1>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`flex flex-col items-center gap-1.5 rounded-lg py-3 text-[12px] transition-colors ${
                  format === f.id
                    ? "bg-accent-wash text-accent ring-1 ring-accent"
                    : "bg-surface text-ink-soft hairline hover:bg-surface-sunk"
                }`}
              >
                {f.icon}
                {f.th}
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ตั้งชื่อข้อความ (เห็นเฉพาะคุณ)"
            className="mt-5 w-full border-b border-line bg-transparent pb-2 font-serif text-xl text-ink outline-none placeholder:text-muted/60 focus:border-accent"
          />
          {format === "text" ? (
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="เขียนสิ่งที่อยากบอก…"
              className="mt-4 w-full resize-none rounded-lg bg-surface p-4 font-serif text-[16px] leading-relaxed text-ink outline-none hairline placeholder:text-muted/60"
            />
          ) : (
            <Card className="mt-4 flex flex-col items-center py-8">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-paper">
                {format === "audio" ? <MicIcon large /> : format === "video" ? <VideoIcon large /> : <FileIcon large />}
              </span>
              <p className="mt-3 text-[14px] text-ink-soft">
                {format === "file" ? "เลือกไฟล์ที่จะแนบ" : "แตะเพื่อเริ่มบันทึก"} (ตัวอย่าง)
              </p>
            </Card>
          )}
          <Continue onClick={next} disabled={!title.trim()} />
        </div>
      )}

      {/* RECIPIENT */}
      {key === "recipient" && (
        <div>
          <SectionLabel>2 · ผู้รับ · Recipient</SectionLabel>
          <h1 className="mt-1.5 text-2xl text-ink">ใครเปิดอ่านได้</h1>
          <div className="mt-5 space-y-2">
            {recipients.map((r) => (
              <OptionCard
                key={r.id}
                selected={recipientId === r.id}
                onClick={() => setRecipientId(r.id)}
                title={r.full_name}
                sub={`${r.relationship}${r.email || r.phone ? ` · ${r.email || r.phone}` : ""}`}
              />
            ))}

            {/* Add someone new */}
            {!addingRecipient ? (
              <button
                onClick={() => setAddingRecipient(true)}
                className="flex w-full items-center gap-2 rounded-lg border border-dashed border-line p-4 text-left text-[14px] text-ink-soft transition-colors hover:bg-surface"
              >
                <span className="text-lg leading-none text-accent">+</span>
                เพิ่มผู้รับใหม่ · Add someone new
              </button>
            ) : (
              <Card className="space-y-3 p-4">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ชื่อผู้รับ · Their name"
                  className="w-full border-b border-line bg-transparent pb-1.5 text-[15px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
                />
                <input
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="อีเมลหรือเบอร์โทร · Email or phone"
                  className="w-full border-b border-line bg-transparent pb-1.5 text-[15px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
                />
                <input
                  value={newRel}
                  onChange={(e) => setNewRel(e.target.value)}
                  placeholder="ความสัมพันธ์ (เช่น ลูก เพื่อน) · Relationship"
                  className="w-full border-b border-line bg-transparent pb-1.5 text-[15px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
                />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={saveNewRecipient}
                    disabled={!newName.trim() || !newContact.trim()}
                    className="rounded-full bg-accent px-5 py-2 text-[14px] font-medium text-paper transition-colors hover:bg-[#946f3e] disabled:opacity-40"
                  >
                    บันทึก · Save
                  </button>
                  <button
                    onClick={() => setAddingRecipient(false)}
                    className="px-3 py-2 text-[14px] text-muted hover:text-ink"
                  >
                    ยกเลิก
                  </button>
                </div>
                <p className="text-[11.5px] text-muted">
                  ข้อมูลทดสอบเท่านั้น · ไม่มีการส่งอีเมลหรือ SMS จริง
                </p>
              </Card>
            )}
          </div>
          {/* How they're reached / notified */}
          <div className="mt-6">
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
              วิธีส่งถึงผู้รับ · How they&rsquo;re reached
            </p>
            <div className="mt-3 space-y-2">
              {CHANNELS.map((c) => (
                <OptionCard
                  key={c.id}
                  selected={deliveryChannel === c.id}
                  onClick={() => setDeliveryChannel(c.id)}
                  title={`${c.th} · ${c.en}`}
                  sub={c.note}
                />
              ))}
            </div>

            {deliveryChannel === "postal" && (
              <div className="mt-3">
                <textarea
                  rows={2}
                  value={postalAddress}
                  onChange={(e) => setPostalAddress(e.target.value)}
                  placeholder="ที่อยู่สำหรับจัดส่ง (ตัวอย่าง)"
                  className="w-full resize-none rounded-lg bg-surface p-3 text-[14px] text-ink outline-none hairline placeholder:text-muted/60"
                />
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
                  ซองไม่ระบุเนื้อหาหรือผู้ส่ง เพื่อความเป็นส่วนตัว ·
                  ส่งแบบลงทะเบียนเพื่อยืนยันการรับ
                </p>
              </div>
            )}

            {deliveryChannel === "trusted_relay" && (
              <div className="mt-3 space-y-2">
                {trustedPersons.map((tp) => (
                  <OptionCard
                    key={tp.id}
                    selected={relayPersonId === tp.id}
                    onClick={() => setRelayPersonId(tp.id)}
                    title={tp.full_name}
                    sub={TRUSTED_ROLE_LABELS[tp.role] ?? tp.role}
                  />
                ))}
                {trustedPersons.length === 0 && (
                  <Card className="p-4 text-center text-[13px] text-muted">
                    ยังไม่มีผู้ที่ไว้วางใจ — เพิ่มได้ในหน้า “ผู้รับ” (Slice 4)
                  </Card>
                )}
              </div>
            )}
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={identityRequired}
              onChange={(e) => setIdentityRequired(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            <span className="text-[13.5px] text-ink-soft">
              ต้องยืนยันตัวตนก่อนเปิด (OTP) · Verify identity before opening
            </span>
          </label>
          <Continue
            onClick={next}
            disabled={
              !recipientId ||
              (deliveryChannel === "trusted_relay" &&
                trustedPersons.length > 0 &&
                !relayPersonId)
            }
          />
        </div>
      )}

      {/* TRIGGER */}
      {key === "trigger" && (
        <div>
          <SectionLabel>3 · เงื่อนไขเวลา · Trigger</SectionLabel>
          <h1 className="mt-1.5 text-2xl text-ink">เปิดได้เมื่อไหร่</h1>
          <div className="mt-5 space-y-2">
            {TRIGGERS.map((t) => (
              <OptionCard
                key={t}
                selected={triggerType === t}
                onClick={() => setTriggerType(t)}
                title={TRIGGER_LABELS[t]}
                sub={triggerHint(t)}
              />
            ))}
          </div>
          {triggerType === "date" && (
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="mt-4 w-full rounded-lg bg-surface p-3 text-[15px] text-ink outline-none hairline focus:border-accent"
            />
          )}
          <Continue
            onClick={next}
            disabled={triggerType === "date" && !releaseDate}
          />
        </div>
      )}

      {/* PRIVACY & DESTRUCTION */}
      {key === "privacy" && (
        <div>
          <SectionLabel>4 · ความเป็นส่วนตัว · Privacy</SectionLabel>
          <h1 className="mt-1.5 text-2xl text-ink">เปิดแล้วให้เป็นอย่างไร</h1>
          <div className="mt-5 space-y-2">
            {VISIBILITIES.map((v) => (
              <OptionCard
                key={v}
                selected={visibility === v}
                onClick={() => setVisibility(v)}
                title={VISIBILITY_LABELS[v]}
                sub={visibilityHint(v)}
              />
            ))}
          </div>
          <div className="mt-4 space-y-3 rounded-lg bg-surface p-4 hairline">
            <Toggle label="ลายน้ำกันการแชร์ · Watermark" on={watermark} set={setWatermark} />
            <Toggle label="อนุญาตให้ดาวน์โหลด · Allow download" on={allowDownload} set={setAllowDownload} />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            {SECURITY_HONESTY.th}
          </p>
          <Continue onClick={next} />
        </div>
      )}

      {/* SEAL — the vault ritual */}
      {key === "seal" && (
        <div>
          <SectionLabel>5 · ปิดผนึก · Seal</SectionLabel>
          <h1 className="mt-1.5 text-2xl text-ink">{MICROCOPY.seal.heading}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            {MICROCOPY.seal.body}
          </p>

          <Card className="mt-5 p-5">
            <p className="text-[12.5px] leading-relaxed text-ink-soft">
              {DISCLAIMER.th}
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              {DISCLAIMER.en}
            </p>
          </Card>

          <div className="mt-8 flex justify-center">
            <SealRitual accent={sealAccent} onComplete={seal} />
          </div>
          <p className="mt-6 text-center text-[12px] text-muted">
            กลับไปแก้ไขได้ก่อนปิดผนึก — แตะ “ย้อนกลับ” ด้านบน
          </p>
        </div>
      )}

      {/* DONE — quiet confirmation */}
      {key === "done" && (
        <div className="py-6 text-center">
          <Art name="bloom" className="mx-auto h-20 w-20" />
          <h1 className="mt-5 font-display text-3xl font-light text-ink">
            ปิดผนึกข้อความแล้ว
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            “{title || "ข้อความของคุณ"}” ถูกเก็บอย่างปลอดภัย
            และจะเปิดได้ตามเงื่อนไขที่คุณกำหนดเท่านั้น
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Pill>{VISIBILITY_LABELS[visibility]}</Pill>
            <Pill>{TRIGGER_LABELS[triggerType]}</Pill>
            <Pill>{DELIVERY_LABELS[deliveryChannel]}</Pill>
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={() => router.push("/app/dashboard")}
              className="rounded-full bg-accent px-8 py-3.5 text-[15px] font-medium text-paper transition-colors hover:bg-[#946f3e]"
            >
              ดูพื้นที่ของฉัน · See my space
            </button>
            <button
              onClick={reset}
              className="rounded-full px-6 py-3 text-[15px] text-ink-soft transition-colors hover:text-ink"
            >
              เขียนอีกข้อความ · Write another
            </button>
            {newId && (
              <Link
                href={`/open/${newId}`}
                className="text-[13px] text-muted underline-offset-4 hover:text-ink-soft hover:underline"
              >
                ดูในมุมผู้รับ (ตัวอย่าง) · Preview as recipient →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function triggerHint(t: TriggerType): string {
  switch (t) {
    case "date": return "เปิดเองในวันที่กำหนด";
    case "inactivity": return "เมื่อคุณไม่ตอบกลับการเช็คอิน";
    case "trusted_person": return "เมื่อผู้ที่ไว้วางใจยืนยัน";
    case "death_verification": return "เมื่อมีการยืนยันการเสียชีวิต (ตรวจสอบโดยทีมงาน)";
    default: return "";
  }
}
function visibilityHint(v: VisibilityMode): string {
  switch (v) {
    case "recipient_only": return "เปิดอ่านได้ตามปกติ เฉพาะผู้รับ";
    case "one_time": return "เปิดได้ครั้งเดียว แล้วปิด";
    case "self_destruct": return "เปิดได้ครั้งเดียว แล้วทำลายถาวร";
    default: return "";
  }
}

// --- local UI ---------------------------------------------------------------

function Continue({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <div className="mt-7">
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-[15px] font-medium text-paper transition-colors hover:bg-[#946f3e] disabled:cursor-not-allowed disabled:opacity-40"
      >
        ดำเนินต่อ · Continue
      </button>
    </div>
  );
}

function OptionCard({
  title, sub, selected, onClick,
}: { title: string; sub: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors ${
        selected ? "bg-accent-wash ring-1 ring-accent" : "bg-surface hairline hover:bg-surface-sunk"
      }`}
    >
      <span>
        <span className="block font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted">{sub}</span>
      </span>
      <span className={`ml-3 h-5 w-5 shrink-0 rounded-full border ${selected ? "border-accent bg-accent" : "border-line"}`} />
    </button>
  );
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button onClick={() => set(!on)} className="flex w-full items-center justify-between">
      <span className="text-[14px] text-ink">{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-accent" : "bg-line"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface-sunk px-3 py-1 text-[12px] text-ink-soft">
      {children}
    </span>
  );
}

function PenIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>; }
function MicIcon({ large }: { large?: boolean }) { const s = large ? 28 : 20; return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>; }
function VideoIcon({ large }: { large?: boolean }) { const s = large ? 28 : 20; return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10 6-3.2v10.4l-6-3.2"/></svg>; }
function FileIcon({ large }: { large?: boolean }) { const s = large ? 28 : 20; return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5"/><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z"/></svg>; }
