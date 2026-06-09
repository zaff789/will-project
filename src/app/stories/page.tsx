/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { Reveal } from "@/components/Reveal";
import { Art } from "@/components/Art";
import { SiteFooter } from "@/components/SiteFooter";
import { USE_CASES } from "@/lib/usecases";
import { PACKAGE_LABELS } from "@/lib/content";

export const metadata = {
  title: "เรื่องราว · Stories — The Will",
};

// Reference use cases: seven faces, seven stories — spanning packages and the
// six message dimensions. A warm, scrolling, people-forward page.

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PrototypeBanner />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-display text-xl text-ink">
          The Will
        </Link>
        <Link
          href="/signin"
          className="text-sm text-ink-soft transition-colors hover:text-ink"
        >
          เข้าสู่ระบบ · Sign in
        </Link>
      </header>

      {/* Intro */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-6 pt-6">
        <Reveal>
          <Art name="hands" className="h-20 w-20" />
          <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            เรื่องราว · Stories
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.08] text-ink">
            เจ็ดเรื่องราว ของคนที่อยากเก็บบางสิ่งไว้ให้คนสำคัญ
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            ทุกคนมีบางอย่างที่อยากบอก ในเวลาที่เหมาะสม — นี่คือตัวอย่างว่า The Will
            อยู่ตรงนั้นเพื่อใครได้บ้าง
            <span className="mt-1 block text-[13px] text-muted">
              Seven people, seven things worth keeping — illustrative stories.
            </span>
          </p>
        </Reveal>
      </section>

      {/* Stories */}
      <section className="mx-auto w-full max-w-6xl space-y-16 px-6 py-12 sm:space-y-24 sm:py-16">
        {USE_CASES.map((u, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={u.photo}>
              <article className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
                {/* Photo */}
                <div className={flip ? "lg:order-2" : "lg:order-1"}>
                  <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-[0_24px_60px_-30px_rgba(120,80,40,0.5)] ring-1 ring-line">
                    <img
                      src={u.photo}
                      alt=""
                      aria-hidden
                      className="kenburns-loop h-full w-full object-cover"
                      style={{ objectPosition: "50% 28%" }}
                    />
                  </div>
                </div>

                {/* Story */}
                <div className={flip ? "lg:order-1" : "lg:order-2"}>
                  <span className="inline-flex items-center rounded-full bg-accent-wash px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                    {PACKAGE_LABELS[u.package]}
                  </span>
                  <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.18em] text-muted">
                    {u.scenarioTh} · {u.scenarioEn}
                  </p>
                  <h2 className="mt-2 font-serif text-[15px] text-muted">
                    {u.name} · {u.age}
                  </h2>
                  <p className="mt-3 font-serif text-[22px] leading-relaxed text-ink">
                    {u.storyTh}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                    {u.storyEn}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Chip>{u.form}</Chip>
                    <Chip>{u.trigger}</Chip>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-surface/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-light leading-snug text-ink">
              เรื่องราวต่อไป อาจเป็นของคุณ
            </h2>
            <p className="mt-2 text-[15px] text-ink-soft">
              The next story could be yours.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-[15px] font-medium text-paper transition-colors hover:bg-[#946f3e]"
              >
                เริ่มต้น · Begin
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-line px-8 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-surface"
              >
                กลับหน้าหลัก · Home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[12.5px] text-ink-soft hairline">
      {children}
    </span>
  );
}
