# The Will — Build Kit

> Internal build name: **WillVault**. Market name under evaluation: **The Will**.
> See the naming note in `CONTENT.md` before committing the public name.

This folder is the operating brain for building **The Will** with Claude Code,
Mobbin, and Impeccable. Read this file first, then `CLAUDE.md`.

---

## What this build IS

A **high-fidelity, clickable prototype** of The Will — an encrypted legacy,
memory, and continuity vault — running on **synthetic data only**.

The goal of this build is to:

1. Make every flow and screen feel real enough to validate with users and pitch to partners.
2. Prove the product concept (the "felt experience" of sealing a message and a recipient opening it).
3. Produce a clean **security handoff spec** (`SECURITY_HANDOFF.md`) for the technical partner who will own the real backend.

## What this build IS NOT

- **Not production.** No real users. No real personal data. Ever, in this repo.
- **Not the real security system.** Encryption, key management, real auth, the
  release engine, and the audit chain are **stubbed behind clearly-marked
  interfaces** — never faked as secure.
- **Not a deployable product.** If hosted at all, it carries a permanent
  "PROTOTYPE — synthetic data only" banner.

**Why this boundary exists:** The Will's entire value is a security and trust
promise to vulnerable people. A non-verified backend with real users is the one
thing that ends the company. The market will also force this — no bank, insurer,
or law firm (the Phase 3 distribution partners) will distribute a legacy/death-data
product without an audited, engineer-owned security layer. The prototype is the
fundable, partner-ready version that moves at full speed without that risk.

---

## File map

| File | Purpose | Who reads it |
| --- | --- | --- |
| `README.md` | Orientation + build sequence | You + Claude Code |
| `CLAUDE.md` | The operating contract for Claude Code | Claude Code (load first) |
| `PRODUCT.md` | What we're building — spec, packages, engine, data model | Claude Code + partner |
| `DESIGN.md` | Design language, screen inventory, Mobbin patterns | Claude Code + Impeccable |
| `CONTENT.md` | Voice, Thai/English copy, disclaimers, microcopy | Claude Code |
| `SECURITY_HANDOFF.md` | The real-security spec for the technical partner | Future engineer/partner |

---

## Tooling roles (system leads, people follow)

- **Mobbin** — UI pattern reference. Pull real-world patterns per screen (see `DESIGN.md`).
- **Impeccable** — design pass + anti-slop. Run on each screen before it's "done."
- **Claude Code** — build executor. Follows `CLAUDE.md`. Builds the experience, stubs the security layer.
- **You** — director and approver. You own validation gates. No screen ships without your sign-off.

**Non-negotiable:** the design-engineer spec breakdown is never skipped before
building a screen. Spec → Mobbin reference → build → Impeccable pass → your approval.

---

## Build sequence (prototype)

Work one slice at a time. Validate before moving on.

1. **Shell** — Next.js + TypeScript + Tailwind, layout, navigation, mock-auth, synthetic personas seeded.
2. **Dashboard** — the vault home: what a user sees on login.
3. **Message creation** — the core loop. Category → content → recipient → trigger → privacy/destruction → seal.
4. **Recipient + trusted-person management** — the "who" screens.
5. **The recipient experience** — secure link → OTP screen → viewer → self-destruct moment. (Highest emotional stakes — see `DESIGN.md`.)
6. **Trigger simulation** — a "time machine" control to fast-forward dates / simulate inactivity and demo release.
7. **Admin view** — metadata-only operator dashboard (no plaintext content, even in the prototype).
8. **Family + Founder templates** — the same engine, dressed per segment.

Each slice ends with: does this match reality? what's wrong? what adjusts before we lock it?
