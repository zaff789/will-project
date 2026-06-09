# The Will — prototype (WillVault)

A high-fidelity, **clickable prototype** of *The Will* — an encrypted legacy,
memory, and continuity vault. Thai-first, bilingual (TH/EN).

> ⚠️ **PROTOTYPE — synthetic data only.** This is **not** a production product.
> Encryption, key management, real auth/OTP, the release engine, and the audit
> chain are **stubbed** behind clearly-marked interfaces — never faked as secure.
> No real users, no real data. See the handoff docs before building for real.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3010
npm run build    # production build
```

## What's built (all 8 slices)
Landing + Stories · onboarding (intent-driven + sealing ritual) · vault dashboard
(check-in + live lifecycle) · message creation (6 dimensions + delivery channels +
templates + seal) · recipient experience (secure link → viewer → self-destruct) ·
Time Machine (simulated triggers/release) · metadata-only admin · recipients &
trusted persons.

## Stack
Next.js 16 (App Router) + TypeScript + Tailwind v4 + Zustand (in-memory mock store).
Fonts: Noto Serif Thai · IBM Plex Sans Thai · Cormorant · Fraunces.

## Docs (the operating brain)
- `CLAUDE.md` — operating contract (security boundary).
- `docs/PRODUCT.md` · `docs/DESIGN.md` · `docs/CONTENT.md` — product, design, copy.
- `docs/SECURITY_HANDOFF.md` — what the real backend must implement.
- `docs/REAL_BUILD_ROADMAP.md` — prototype → real product (people, phases, gate).
- `docs/SUPABASE_MAPPING.md` — how it lands on Supabase + Vercel.
- `docs/ONBOARDING_FLOW.md` — the onboarding journey.

## The boundary (why)
The Will's whole value is a security and trust promise to vulnerable people. A real
launch requires a qualified, named security engineer to own the real backend (per
`SECURITY_HANDOFF.md`), an audit + pen-test, and PDPA sign-off — *before* any real
user data. This repo is the fundable, partner-ready demo that moves fast without
that risk.
