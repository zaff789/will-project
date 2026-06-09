# CLAUDE.md — Operating Contract for The Will

Load this before doing anything. These rules override convenience, speed, and
your own defaults. When in doubt, stop and ask the director.

---

## 1. What you are building

A **high-fidelity clickable prototype** of **The Will** (internal: WillVault) — an
encrypted legacy, memory, and continuity vault. Users create private messages,
voice notes, videos, files, memories, life instructions, and founder-continuity
notes, released only to selected recipients, only under selected triggers, only
under chosen privacy/destruction rules.

The core engine is one **universal encrypted conditional message engine**.
Personal, Family, and Founder are *packages* (seats, templates, limits, pricing),
**not** separate architectures. **Access control is per message, never per package.**
A family member does not get to read everything; an advisor does not get to read everything.

Full product detail is in `PRODUCT.md`. Read it before building flows.

---

## 2. PRIME DIRECTIVE — the security boundary

This is a prototype on **synthetic data only**. You will build the full
*experience* and **stub** the security-critical layer. You will never fake
security as real.

### You DO build (full fidelity):
- All screens, flows, navigation, transitions, empty/loading/error states.
- A mock data layer: TypeScript types + an in-memory store seeded with synthetic personas (see `PRODUCT.md`).
- The complete felt experience — including the emotionally heavy moments: sealing a message, OTP entry, the recipient viewer, the self-destruct moment, the inactivity check-in.
- A **trigger-simulation control** ("time machine") so demos can fast-forward dates and simulate inactivity/release without real time or real email.

### You STUB (behind a clearly-marked interface, never a real implementation):
- Encryption / decryption (`EncryptionService`)
- Key management (`KeyService`)
- Real authentication / identity verification (`AuthService`)
- The trigger + release engine (`ReleaseEngine`) — simulated only
- Audit hash-chain (`AuditService`) — log to console/mock store, do not claim tamper-proof
- Email/SMS delivery (`NotificationService`) — never send to a real address
- Payment / subscription (`BillingService`)

### Every stubbed module starts with this header, verbatim:
```ts
// ⚠️ PROTOTYPE STUB — NOT SECURE. NOT FOR REAL USER DATA.
// This module simulates behavior for the prototype only. A qualified security
// engineer must own the real implementation before any real user data.
// Spec: see SECURITY_HANDOFF.md
```

### You NEVER:
- Implement real cryptography and present it as production-grade.
- Wire any flow to a real email address, phone number, or person.
- Persist anything resembling real PII. Seed data must be obviously synthetic.
- Connect a live database holding real data. Mock store only.
- Remove or hide the "PROTOTYPE — synthetic data only" banner.
- Tell the director the app is "ready for users," "secure," or "production-ready."
- Build: real legal-will features, government death-registry integration, blockchain, asset transfer, eKYC, financial execution.

If a task would cross this boundary, **stop and say so.** Propose the in-boundary version instead.

---

## 3. Tech approach (prototype)

- **Next.js (App Router) + TypeScript + Tailwind CSS.**
- **Mock data layer:** TypeScript fixtures + a small in-memory store (e.g. Zustand or React context). No Postgres, no Prisma-to-live-DB, no S3 in this build.
- Keep the **data model in `PRODUCT.md` as the contract** — model your TS types on it so the partner build maps cleanly later. The Prisma schema is a *design artifact* for the handoff, not something you wire to real data here.
- **Trigger simulation:** an in-app dev panel to set "now," advance time, fire a date trigger, simulate a missed check-in, and manually release — so the full lifecycle demos without real time or real delivery.
- Mobile-first. Most Thai users will meet this on a phone.

---

## 4. Language rules

- **All user-facing text is Thai** (mixed Thai-English acceptable where natural for a Thai audience). Pull approved copy and disclaimers from `CONTENT.md` — do not improvise legal or sensitive copy.
- **Code, comments, file names, and technical docs are English.**
- Never machine-translate the disclaimers. Use the exact strings in `CONTENT.md`.

---

## 5. Design workflow (never skipped)

For each screen, in order:
1. **Spec** the screen from `PRODUCT.md` + `DESIGN.md` (inputs, outputs, states, decision points).
2. **Mobbin** — reference the pattern named for that screen in `DESIGN.md`. Adapt, don't copy.
3. **Build** it.
4. **Impeccable** — run the design pass + anti-slop detector. Fix flagged generic/templated choices.
5. **Director approval** — summarize what you built in plain language and ask: does this match reality, what's wrong, what adjusts. **Do not start the next screen until approved.**

Follow `DESIGN.md` for the design language. Do not invent a new visual direction per screen — consistency is the point.

---

## 6. Sensitive-content care

This product handles death, final messages, confessions, and family grief. In
every flow:
- Never make light of death or loss. Tone is calm, warm, and serious. See `CONTENT.md` voice.
- The recipient-viewer (someone opening a final message) is the single most
  emotionally important screen. Treat it with extraordinary restraint — no
  celebratory animation, no marketing, no upsell.
- Show the legal disclaimer at onboarding and at message-sealing, using the exact `CONTENT.md` text.
- Self-destruct UX must be unmistakable and require deliberate confirmation. Destruction is irreversible by design.

---

## 7. Definition of done (prototype)

A slice is done when: it follows `DESIGN.md`, passes Impeccable, uses only
synthetic data, keeps every security-critical piece behind a marked stub, shows
the prototype banner, and the director has approved it. Not before.
