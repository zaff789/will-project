# DESIGN.md — The Will

The design language and screen plan. Consistency is the product. Do not invent a
new direction per screen. Run every screen through Mobbin (reference) and
Impeccable (anti-slop) before it is "done."

---

## 1. The design tension to hold

The Will lives between two feelings that usually fight:

- **Trust-tech** — this holds my most private, irreversible content. It must feel *secure, deliberate, and serious.*
- **Human warmth** — this is about love, memory, and final words. It must feel *gentle, calm, and human — never morbid, never cold.*

The whole design job is holding both at once. Reference points: the quiet
confidence of a private bank or a notary, crossed with the warmth of a
well-made memory/journal app. **Avoid:** funeral/morbid imagery, generic SaaS
gradients, playful or "fun" UI, fear-based urgency.

---

## 2. Visual direction (starting point — refine with Impeccable)

- **Mood:** calm, spacious, unhurried. Generous whitespace signals "this is safe and considered."
- **Color:** a restrained, trustworthy base (deep ink/navy or warm charcoal) with a single warm accent (muted gold, terracotta, or warm sage) used sparingly for the human/emotional moments. One accent, not a palette of them.
- **Type:** a humanist serif or warm sans for headings (gives gravity + warmth); a clean readable sans for body. Must support **Thai script properly** — pick a typeface with a real Thai cut (e.g. a Noto Sans/Serif Thai pairing or an Anuphan/IBM Plex Sans Thai-class face). Test Thai line-height and tone marks early.
- **Motion:** slow, soft, deliberate. Transitions feel like closing a drawer, not a notification pop. **No celebratory motion anywhere near death/release/destruction.**
- **Imagery:** abstract, warm, light-touch. Avoid stock photos of crying families or gravestones. Texture and light over literal imagery.

---

## 3. Screen inventory + Mobbin references

For each screen: spec from `PRODUCT.md`, pull the Mobbin pattern, build, run
Impeccable, get approval.

| # | Screen | What it must convey | Mobbin pattern to reference |
| --- | --- | --- | --- |
| 1 | Onboarding + disclaimer | Calm welcome; honest legal positioning; consent | Onboarding / first-run consent flows |
| 2 | Vault dashboard | Overview of vaults, messages, check-in status | Finance/portfolio dashboards; secure-app home screens |
| 3 | Create message — category | Choose what you're leaving (the 6 dimensions begin) | Multi-step creation / wizard flows |
| 4 | Create message — content | Write/record text, audio, video, file | Note/journal editors; voice-memo capture |
| 5 | Create message — recipient | Who can open it | Contact picker / share-with patterns |
| 6 | Create message — trigger | When it opens (date / inactivity / trusted person) | Scheduling / reminder-setup flows |
| 7 | Create message — privacy & destruction | Recipient-only, watermark, one-time, expiry, self-destruct | Privacy/permission settings; toggles with consequences |
| 8 | Seal confirmation | Deliberate, weighty commit + disclaimer | Irreversible-action confirmation patterns |
| 9 | Recipient management | Add/edit recipients & relationships | Contact list / CRM-light |
| 10 | Trusted-person management | Confirmers, emergency contacts, verification status | Team/roles management |
| 11 | **Recipient experience** | Secure link → OTP → viewer → self-destruct | Secure-link access; OTP entry; protected document viewer |
| 12 | Check-in flow | "Are you there?" inactivity check-in | Lightweight confirmation prompts |
| 13 | Admin (metadata only) | Operate trust workflow without reading content | Ops/admin dashboards; moderation queues |
| 14 | Family & Founder template galleries | Same engine, dressed per segment | Template galleries / starting-point pickers |

---

## 4. The recipient experience — design with extraordinary care (screen 11)

This is someone opening a final message, possibly from someone who has died.
Everything about it must say *you are safe, this is real, take your time.*

- No app chrome competing for attention. No navigation, no upsell, no branding push.
- A slow, deliberate reveal — not an instant dump. Let the recipient breathe.
- OTP/verification framed as protection ("เพื่อให้แน่ใจว่าเป็นคุณ"), not friction.
- Watermark and no-download presented honestly, without alarm.
- For a one-time/self-destruct message: a clear, gentle warning *before* opening that this can be viewed once, and a calm confirmation. After it closes, a quiet, dignified end state — never an error, never "content not found."

Build this screen with Impeccable's anti-slop pass run twice. Generic patterns here read as disrespectful.

---

## 5. Anti-slop guardrails (Impeccable focus)

Flag and remove: default Tailwind purple/indigo gradients, emoji in serious
flows, exclamation marks, "🎉"-style success states, generic card grids with no
hierarchy, placeholder lorem ipsum left in, three-equal-columns feature layouts,
and any motion that reads as "fun." Every screen should look *chosen*, not
generated.

---

## 6. Accessibility & Thai-first reminders

- Design for an older audience on the Family side: larger default type, high contrast, generous tap targets.
- Test all layouts with **real Thai copy** from `CONTENT.md`, not English placeholder — Thai runs longer and stacks tone marks; English mockups lie about spacing.
- Mobile-first throughout.
