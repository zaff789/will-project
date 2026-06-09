"use client";

import { useRouter } from "next/navigation";
import { Card, SectionLabel, Button, Pill } from "@/components/ui";
import { PACKAGE_LABELS } from "@/lib/content";
import { useWillStore, packageForUser } from "@/lib/store";
import {
  EncryptionService,
  ReleaseEngine,
  AuditService,
  BillingService,
} from "@/lib/stubs";

// Account screen for the Shell slice: who you are signed in as (mock-auth),
// package limits, and an honest list of which subsystems are stubbed.

const STUBS = [
  { name: "การเข้ารหัส (Encryption)", note: EncryptionService.describe() },
  { name: "การปล่อยข้อความ (Release Engine)", note: ReleaseEngine.describe() },
  { name: "บันทึกตรวจสอบ (Audit)", note: AuditService.describe() },
  { name: "การชำระเงิน (Billing)", note: BillingService.describe() },
];

export default function AccountPage() {
  const router = useRouter();
  const { data, currentUserId } = useWillStore();
  const user = data.users.find((u) => u.id === currentUserId);
  const pkg = packageForUser(data, currentUserId);

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>บัญชี</SectionLabel>
        <h1 className="mt-1.5 text-2xl text-ink">{user?.full_name}</h1>
        <p className="mt-1 text-[14px] text-muted">{user?.email}</p>
      </div>

      {pkg && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-ink">
              แพ็กเกจ {PACKAGE_LABELS[pkg.package_type]}
            </p>
            <Pill tone="accent">{pkg.package_status}</Pill>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <dt className="text-[12px] text-muted">ที่นั่ง</dt>
              <dd className="font-serif text-xl text-ink">{pkg.max_members}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted">ผู้รับสูงสุด</dt>
              <dd className="font-serif text-xl text-ink">{pkg.max_recipients}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-muted">พื้นที่ (MB)</dt>
              <dd className="font-serif text-xl text-ink">{pkg.storage_limit_mb}</dd>
            </div>
          </dl>
        </Card>
      )}

      <div>
        <SectionLabel>สถานะระบบความปลอดภัย (ต้นแบบ)</SectionLabel>
        <Card className="mt-3 divide-y divide-line p-0">
          {STUBS.map((s) => (
            <div key={s.name} className="flex items-start gap-3 p-4">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
              <div>
                <p className="text-[14px] font-medium text-ink">{s.name}</p>
                <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
                  {s.note}
                </p>
              </div>
            </div>
          ))}
        </Card>
        <p className="mt-2 text-[12px] leading-relaxed text-muted">
          ทุกส่วนด้านบนเป็นการจำลองเพื่อสาธิตเท่านั้น วิศวกรความปลอดภัยจะต้องสร้างของจริง
          ก่อนนำไปใช้กับผู้ใช้จริง (ดู SECURITY_HANDOFF.md)
        </p>
      </div>

      <Button variant="quiet" className="w-full" onClick={() => router.push("/")}>
        สลับบัญชี / ออกจากระบบ
      </Button>
    </div>
  );
}
