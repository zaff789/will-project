"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { SealRitual } from "@/components/SealRitual";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Art } from "@/components/Art";
import { RotatingQuote } from "@/components/RotatingQuote";
import { ReleaseFlow } from "@/components/ReleaseFlow";
import { DISCLAIMER } from "@/lib/content";
import { ARCHETYPES, archetype, type ArchetypeId } from "@/lib/archetypes";
import { useWillStore } from "@/lib/store";

const HERO_IMAGES = ["/hero/1.png", "/hero/2.png", "/hero/3.png"];

// Onboarding flow — intent-driven & experiential. A guided one-question-per-screen
// wizard that adapts its mood (accent/aurora) to the intent you carry, and shows a
// futuristic conditional-release visualization. No real auth/data — the chosen
// segment maps to a seeded demo persona (mock-auth). Spec: docs/ONBOARDING_FLOW.md.

type Segment = "personal" | "family" | "founder";

const SEGMENTS: { id: Segment; persona: string; th: string; en: string; note: string }[] = [
  { id: "personal", persona: "u_anan", th: "เพื่อตัวคุณเอง", en: "Yourself", note: "ข้อความส่วนตัว ความทรงจำ และสิ่งที่อยากเก็บไว้" },
  { id: "family", persona: "u_malee", th: "เพื่อครอบครัว", en: "Your family", note: "ข้อความถึงคู่ชีวิต ลูก และคนที่คุณรัก" },
  { id: "founder", persona: "u_ploy", th: "เพื่อธุรกิจของคุณ", en: "Your business", note: "ความต่อเนื่องของกิจการ คำสั่งถึงทีมและที่ปรึกษา" },
];

const STEPS = ["opening", "name", "carry", "who", "consent", "release", "begin", "ready"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { setCurrentUser } = useWillStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [carry, setCarry] = useState<ArchetypeId | null>(null);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [consent, setConsent] = useState(false);

  const key = STEPS[step];
  const progress = step / (STEPS.length - 1);
  const firstName = name.trim() || "คุณ";
  const chosen = archetype(carry);
  const accent = chosen?.accent ?? "#a9824c";
  const flowArch = chosen ?? ARCHETYPES[2]; // legacy as a sensible default

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function finish(target: "dashboard" | "messages") {
    const seg = SEGMENTS.find((s) => s.id === segment) ?? SEGMENTS[0];
    setCurrentUser(seg.persona);
    router.push(target === "messages" ? "/app/messages" : "/app/dashboard");
  }

  return (
    <div
      className="aurora relative flex min-h-screen flex-col overflow-hidden bg-paper text-ink"
      style={{ ["--ob-accent" as string]: accent }}
    >
      {/* Ambient transparent people — warm emotional presence behind the steps. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[78%] opacity-[0.16]"
      >
        <HeroCarousel images={HERO_IMAGES} objectPosition="center" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(90deg, var(--color-paper) 26%, rgba(246,242,234,0.55) 52%, rgba(246,242,234,0.2) 100%), linear-gradient(0deg, var(--color-paper) 4%, transparent 34%)",
        }}
      />

      <PrototypeBanner />

      {/* Progress + back */}
      <div className="relative z-10 mx-auto w-full max-w-lg px-6 pt-5">
        <div className="flex items-center gap-4">
          {step > 0 && key !== "ready" ? (
            <button
              onClick={back}
              className="text-[13px] text-muted transition-colors hover:text-ink-soft"
            >
              ← ย้อนกลับ
            </button>
          ) : (
            <span className="text-[13px] text-muted">The Will</span>
          )}
          <div className="h-px flex-1 bg-line">
            <div
              className="h-px transition-all duration-500"
              style={{
                width: `${Math.max(progress, 0.04) * 100}%`,
                background: "var(--ob-accent)",
              }}
            />
          </div>
        </div>
      </div>

      <main
        key={key}
        className="motion-drawer relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 pb-16 pt-4"
      >
        {key === "opening" && (
          <div className="text-center">
            <Art name="hands" className="mx-auto mb-6 h-24 w-24" />
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
              ยินดีต้อนรับ · Welcome
            </p>
            <h1 className="mt-6 font-display text-4xl font-light leading-snug sm:text-5xl">
              เราจะค่อย ๆ ไปด้วยกัน
            </h1>
            <p className="mt-3 font-serif text-lg text-ink-soft">
              We&rsquo;ll take this gently.
            </p>
            <p className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              คำถามสั้น ๆ ไม่กี่ข้อเพื่อเตรียมพื้นที่ของคุณ — ไม่มีอะไรถูกส่งหรือเปิดเผย
              จนกว่าคุณจะกำหนดเอง
            </p>
            <RotatingQuote className="mt-8" />
            <div className="mt-9">
              <PrimaryButton onClick={next}>เริ่มต้น · Begin</PrimaryButton>
            </div>
          </div>
        )}

        {key === "name" && (
          <div>
            <StepTitle>เราจะเรียกคุณว่าอะไรดี</StepTitle>
            <StepSub>What should we call you?</StepSub>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && next()}
              placeholder="ชื่อของคุณ"
              className="mt-8 w-full border-b border-line bg-transparent pb-3 font-serif text-2xl text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
            />
            <div className="mt-10">
              <PrimaryButton onClick={next} disabled={!name.trim()}>
                ดำเนินต่อ · Continue
              </PrimaryButton>
            </div>
          </div>
        )}

        {key === "carry" && (
          <div>
            <StepTitle>คุณกำลังเก็บสิ่งใดไว้</StepTitle>
            <StepSub>What do you carry?</StepSub>
            <div className="mt-7 space-y-3">
              {ARCHETYPES.map((opt) => {
                const sel = carry === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setCarry(opt.id)}
                    className={`block w-full rounded-xl p-4 text-left transition-all ${
                      sel ? "bg-surface" : "bg-surface hairline hover:bg-surface-sunk"
                    }`}
                    style={
                      sel
                        ? { boxShadow: `inset 0 0 0 1.5px ${opt.accent}` }
                        : undefined
                    }
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: opt.accent }}
                      />
                      <span className="font-medium text-ink">
                        {opt.titleTh} · {opt.titleEn}
                      </span>
                    </span>
                    <span className="mt-1.5 block pl-[22px] text-[13px] leading-snug text-muted">
                      {opt.lineTh}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8">
              <PrimaryButton onClick={next} disabled={!carry}>
                ดำเนินต่อ · Continue
              </PrimaryButton>
            </div>
          </div>
        )}

        {key === "who" && (
          <div>
            <StepTitle>พื้นที่นี้เพื่อใคร</StepTitle>
            <StepSub>Who is this for?</StepSub>
            <div className="mt-7 space-y-3">
              {SEGMENTS.map((opt) => (
                <SelectCard
                  key={opt.id}
                  selected={segment === opt.id}
                  onClick={() => setSegment(opt.id)}
                  title={`${opt.th} · ${opt.en}`}
                  sub={opt.note}
                />
              ))}
            </div>
            <div className="mt-9">
              <PrimaryButton onClick={next} disabled={!segment}>
                ดำเนินต่อ · Continue
              </PrimaryButton>
            </div>
          </div>
        )}

        {key === "consent" && (
          <div>
            <StepTitle>เรื่องที่อยากให้เข้าใจตรงกัน</StepTitle>
            <StepSub>One thing to understand together</StepSub>
            <div className="mt-6 rounded-lg bg-surface p-5 hairline">
              <p className="text-[13.5px] leading-relaxed text-ink-soft">
                {DISCLAIMER.th}
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                {DISCLAIMER.en}
              </p>
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
              />
              <span className="text-[14px] text-ink">
                ฉันเข้าใจว่า The Will ไม่ใช่พินัยกรรมตามกฎหมาย · I understand The
                Will is not a legal will
              </span>
            </label>
            <div className="mt-9">
              <PrimaryButton onClick={next} disabled={!consent}>
                ดำเนินต่อ · Continue
              </PrimaryButton>
            </div>
          </div>
        )}

        {key === "release" && (
          <div>
            <StepTitle>ข้อความของคุณจะถูกดูแลอย่างไร</StepTitle>
            <StepSub>How it&rsquo;s guarded — and released</StepSub>
            <div className="mt-7">
              <ReleaseFlow a={flowArch} />
            </div>
            <div className="mt-8">
              <PrimaryButton onClick={next}>ดำเนินต่อ · Continue</PrimaryButton>
            </div>
          </div>
        )}

        {key === "begin" && (
          <div className="text-center">
            <StepTitle center>ปิดผนึกพื้นที่ของคุณ</StepTitle>
            <StepSub center>Seal your space</StepSub>
            <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              กดค้างไว้สักครู่ — สิ่งสำคัญของคุณจะถูกเข้ารหัสและปิดผนึก
              ให้เปิดได้เฉพาะเมื่อถึงเวลาที่คุณกำหนด
            </p>
            <div className="mt-10 flex justify-center">
              <SealRitual accent={accent} onComplete={next} />
            </div>
          </div>
        )}

        {key === "ready" && (
          <div className="text-center">
            <Art name="bloom" className="mx-auto mb-5 h-20 w-20" />
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
              พร้อมแล้ว · Ready
            </p>
            <h1 className="mt-6 font-display text-4xl font-light leading-snug sm:text-5xl">
              พื้นที่ของคุณพร้อมแล้ว{name.trim() ? `, ${firstName}` : ""}
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">
              เริ่มจากข้อความแรก หรือสำรวจพื้นที่ของคุณก่อนก็ได้
              <br />
              Start with your first message, or look around first.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <PrimaryButton onClick={() => finish("messages")}>
                เขียนข้อความแรก · Write your first message
              </PrimaryButton>
              <button
                onClick={() => finish("dashboard")}
                className="rounded-full px-6 py-3 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
              >
                ดูพื้นที่ของฉัน · See my space
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- small local building blocks -------------------------------------------

function StepTitle({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <h1
      className={`font-display text-3xl font-light leading-snug text-ink sm:text-4xl ${center ? "text-center" : ""}`}
    >
      {children}
    </h1>
  );
}

function StepSub({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <p className={`mt-2 text-[15px] text-muted ${center ? "text-center" : ""}`}>
      {children}
    </p>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-[15px] font-medium text-paper transition-colors duration-300 hover:bg-[#946f3e] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function SelectCard({
  title,
  sub,
  selected,
  onClick,
}: {
  title: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors ${
        selected
          ? "bg-accent-wash ring-1 ring-accent"
          : "bg-surface hairline hover:bg-surface-sunk"
      }`}
    >
      <span>
        <span className="block font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted">
          {sub}
        </span>
      </span>
      <span
        className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-accent bg-accent" : "border-line"
        }`}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6.2l2.2 2.2 4.8-4.8"
              stroke="var(--color-paper)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
