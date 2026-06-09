"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { Card } from "@/components/ui";
import { DISCLAIMER, PACKAGE_LABELS } from "@/lib/content";
import { useWillStore, packageForUser } from "@/lib/store";

// Sign in / demo accounts (Onboarding 1.1). Light "form side" on warm paper.
// No real authentication (AuthService is a stub) — choose a synthetic persona.

const PERSONAS = [
  { id: "u_anan", en: "Personal", note: "ทิ้งคำขอโทษหนึ่งข้อความ เปิดได้ครั้งเดียว ตามวันที่กำหนด" },
  { id: "u_malee", en: "Family", note: "แม่บันทึกความทรงจำถึงลูก และข้อความสุดท้ายถึงคู่ชีวิต" },
  { id: "u_ploy", en: "Founder", note: "คำสั่งฉุกเฉินถึงที่ปรึกษา จดหมายถึงกรรมการ และที่เก็บเอกสาร" },
  { id: "u_admin", en: "Admin", note: "มุมมองผู้ดูแลระบบ — เห็นเฉพาะข้อมูลกำกับ ไม่เห็นเนื้อหา" },
];

export default function SignInPage() {
  const router = useRouter();
  const { data, setCurrentUser } = useWillStore();
  const [acknowledged, setAcknowledged] = useState(false);

  function choose(userId: string) {
    setCurrentUser(userId);
    router.push(userId === "u_admin" ? "/admin" : "/app/dashboard");
  }

  return (
    <div className="flex min-h-full flex-col">
      <PrototypeBanner />

      <main className="mx-auto w-full max-w-md flex-1 px-6 pb-16 pt-10">
        <Link
          href="/"
          className="text-[13px] text-muted transition-colors hover:text-ink-soft"
        >
          ← กลับ · Back
        </Link>

        <h1 className="mt-6 text-2xl text-ink">
          เข้าสู่ระบบ
          <span className="ml-2 align-middle font-sans text-base text-muted">
            Sign in
          </span>
        </h1>
        <p className="mt-1.5 text-[15px] text-ink-soft">
          เลือกบัญชีตัวอย่างเพื่อเข้าชมต้นแบบ · Choose a demo account to explore the
          prototype
        </p>

        {/* Onboarding disclaimer — exact CONTENT.md strings, EN + TH. */}
        <Card className="mt-6 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            ก่อนเริ่มต้น · Before you begin
          </p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            {DISCLAIMER.th}
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            {DISCLAIMER.en}
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
            />
            <span className="text-[13.5px] text-ink">
              ฉันเข้าใจว่า The Will ไม่ใช่พินัยกรรมตามกฎหมาย · I understand The Will
              is not a legal will
            </span>
          </label>
        </Card>

        <div className="mt-7">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            บัญชีตัวอย่าง · Demo accounts
          </p>
          <div className="mt-3 space-y-3">
            {PERSONAS.map((p) => {
              const user = data.users.find((u) => u.id === p.id);
              const pkg = packageForUser(data, p.id);
              if (!user) return null;
              return (
                <button
                  key={p.id}
                  disabled={!acknowledged}
                  onClick={() => choose(p.id)}
                  className="motion-drawer flex w-full items-center gap-4 rounded-lg bg-surface p-4 text-left hairline transition-colors hover:bg-surface-sunk disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-wash font-serif text-accent">
                    {user.full_name.trim()[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-ink">{user.full_name}</span>
                      <span className="rounded-full bg-surface-sunk px-2 py-0.5 text-[11px] text-ink-soft">
                        {pkg ? PACKAGE_LABELS[pkg.package_type] : p.en}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                      {p.note}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-muted">
          ข้อมูลทั้งหมดเป็นข้อมูลทดสอบที่สมมติขึ้น · Synthetic data only · no real
          encryption, no real email or SMS
        </p>
      </main>
    </div>
  );
}
