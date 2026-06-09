import Link from "next/link";
import { PrototypeBanner } from "@/components/PrototypeBanner";
import { HeroCarousel } from "@/components/HeroCarousel";
import { MeaningfulMessages } from "@/components/MeaningfulMessages";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND } from "@/lib/content";

// Landing hero (Onboarding 0.1) — bright, warm, joyful theme. Smiling, elegant,
// diverse people in a sunlit card; the product framed as celebrating life and
// love rather than grief. Bilingual EN/TH.

const HERO_IMAGES = ["/hero/1.png", "/hero/2.png", "/hero/3.png"];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <PrototypeBanner />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-xl tracking-wide text-ink">
          The Will
        </span>
        <nav className="flex items-center gap-5">
          <Link
            href="/stories"
            className="text-sm text-ink-soft transition-colors duration-300 hover:text-ink"
          >
            เรื่องราว · Stories
          </Link>
          <Link
            href="/signin"
            className="text-sm text-ink-soft transition-colors duration-300 hover:text-ink"
          >
            เข้าสู่ระบบ · Sign in
          </Link>
        </nav>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-10 px-6 pb-16 lg:grid-cols-2 lg:gap-14">
        {/* Image card — first on mobile for emotional impact, right on desktop. */}
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_30px_70px_-28px_rgba(120,80,40,0.45)] ring-1 ring-line sm:aspect-[5/4] lg:aspect-[4/5]">
            <HeroCarousel images={HERO_IMAGES} objectPosition="center" />
          </div>
        </div>

        {/* Text column. */}
        <div className="order-2 lg:order-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-accent">
            For the ones you love
          </p>

          <h1 className="mt-5 font-display font-light leading-[0.92] tracking-tight text-ink text-[clamp(3rem,8vw,6rem)]">
            The Will
          </h1>

          <p className="mt-6 max-w-md font-serif text-[22px] leading-relaxed text-ink">
            ฝากข้อความสุดท้ายที่เต็มไปด้วยความสุข
            <br />
            ไว้ให้คนที่คุณรัก
          </p>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Leave a last happy message for the ones you love — kept safe, opened
            when the time is right.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-[15px] font-medium text-paper transition-colors duration-300 hover:bg-[#946f3e]"
            >
              เริ่มต้น · Begin
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-full border border-line px-8 py-3.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-surface"
            >
              ดูบัญชีตัวอย่าง · Demo accounts
            </Link>
          </div>

          <p className="mt-10 text-[11px] tracking-wide text-muted">
            {BRAND.clarifier} · not a legally executed will
          </p>
        </div>
      </main>

      {/* Meaningful messages — emotional inspiration (photos + heartfelt notes). */}
      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
              ตัวอย่างข้อความ · Messages people leave
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.9rem,4vw,2.75rem)] font-light leading-snug text-ink">
              ถ้อยคำที่อยากเก็บไว้ ให้ถึงคนสำคัญในเวลาที่เหมาะสม
            </h2>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              ตัวอย่างความรู้สึกที่ผู้คนเลือกฝากไว้ — บางคำพูดมีค่าเกินกว่าจะปล่อยให้หายไป
            </p>
          </Reveal>
          <div className="mt-10">
            <MeaningfulMessages />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
