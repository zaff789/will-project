# REAL_BUILD_ROADMAP.md — From prototype to a real, secure product

**Audience:** the director + the qualified security/backend engineer who will own
the real system. This is the *how-to-get-there* companion to `SECURITY_HANDOFF.md`
(the *what-must-be-real* spec). It does not change the prototype boundary: **no real
user data touches anything until the security layer below is built, audited, and
owned by a named, accountable engineer.**

---

## The gate (non-negotiable)
The prototype proves the experience on synthetic data. A real product may onboard
real users **only after**: real encryption + key management, real auth/OTP, the
release engine (no wrongful *or* missed release), a tamper-evident audit log, a
PDPA sign-off, a security audit + penetration test, and a named Tier-3 owner are
all in place. Until then it stays a synthetic-data demo with the PROTOTYPE banner.

---

## 0. What the prototype already gives you (assets, not throwaway)
- The **full UX/UI and flows** (Next.js front-end) — reusable as the front-end of the real backend.
- The **data contract** — TS types that mirror the target **Prisma schema** (`SECURITY_HANDOFF.md` §5).
- The **product spec** (`PRODUCT.md`), **voice/disclaimers** (`CONTENT.md`), **design system** (`DESIGN.md`).
- The **security spec** (`SECURITY_HANDOFF.md`) + **delivery model** (`PRODUCT.md` §10, `SECURITY_HANDOFF.md` §8).
- Clearly-marked **stub interfaces** showing exactly what to replace.

## 1. Ownership & team (do this first)
- **Tier-3 backend/security owner** — a named, accountable engineer/partner who owns the real backend (vet with `SECURITY_HANDOFF.md` §7).
- **Thai data-protection / tech lawyer** — engaged *before* launch (PDPA, death-verification liability, the not-a-legal-will positioning).
- **External security auditor + pen-tester** — booked for the pre-launch gate.
- Decide **data residency** (TH/SG region; PDPA cross-border rules if storage/mail is offshore).

## 2. Architecture target
- **Front-end:** keep the prototype's Next.js app; swap the mock store for real APIs.
- **Backend:** Prisma + Postgres (Row-Level Security), the schema in `SECURITY_HANDOFF.md` §5.
- **Replace each stub with the real module** (`CLAUDE.md` §2 map): EncryptionService, KeyService, AuthService, ReleaseEngine, AuditService, NotificationService, BillingService.
- **Never build (out of scope):** formal legal will, gov death-registry integration, blockchain, asset transfer, eKYC build, financial execution.

## 3. Build order (phased)
Mirrors `SECURITY_HANDOFF.md` §6, grouped into shippable milestones:

- **Phase 1 · Foundation** — Prisma schema + Postgres (RLS), real auth (sessions, recovery), accounts/packages/vaults/recipients/trusted-persons wired to the existing UI.
- **Phase 2 · Encryption & keys** — content encrypted at rest, **architected for end-to-end** (browser-side encrypt; server stores ciphertext only). KMS/HSM-backed keys; rotation, escrow, loss-recovery policy.
- **Phase 3 · Release engine** *(highest risk)* — date worker, inactivity check-in worker, trusted-person + death-verification workflows, each with **cooling period + required confirmations + admin hold + dispute**. Build **monitoring + reconciliation** for both failure modes (wrongful release AND missed release).
- **Phase 4 · Recipient access** — single-purpose, hashed, expiring, open-count-limited tokens; **real OTP** (provider); secure viewer; **self-destruct** = revoke token + destroy/revoke key + DestructionEvent + AuditLog; watermarking.
- **Phase 5 · Audit, admin, billing** — tamper-evident **audit hash chain**; metadata-only admin (no plaintext); payments/subscriptions/limits.
- **Phase 6 · Delivery & notification** — email/SMS with anti-spoofing (DKIM/DMARC/SPF) + rate limits; **Thai Post** fulfillment (registered/EMS, envelope privacy, release-triggered); trusted-relay. Partner contracts + DPAs.
- **Phase 7 · Hardening** — security audit, pen-test, incident-response plan, backups/DR, runbooks, observability.

## 4. Compliance & legal (parallel track)
- **PDPA**: lawful basis, consent, data-subject rights, breach notification, retention/deletion, cross-border transfer; extra care for **physical addresses** (delivery) and the highly-sensitive content category.
- **Death-verification**: define the manual workflow, evidence requirements, dispute handling, and what the company will *not* attest to.
- **Positioning**: keep the **not-a-legal-will** disclaimer enforced in product (onboarding + sealing), exact `CONTENT.md` strings.

## 5. The two hardest subsystems (give them the most time)
1. **Release engine** — wrongful release = permanent harm; missed release = the inverse failure. Confirmations, cooling, admin hold, dispute, reconciliation, and monitoring are all mandatory.
2. **Key management / E2E** — design so the **platform cannot read content** (admins see metadata only). Define rotation/escrow/loss-recovery up front.

## 6. Hosting & data residency
- Front-end (Next.js) can host on Vercel/edge. **Sensitive data + keys** belong in a controlled region (TH/SG) with the KMS/HSM, under PDPA-compliant processing and DPAs with any subprocessor (incl. mail fulfillment).

## 7. Vetting the owner (gate before you hire)
Ask the `SECURITY_HANDOFF.md` §7 questions. If a candidate hand-waves key management, dual release-failure prevention, audit/pentest/incident posture, or refuses named accountability — they are not the owner.

## 8. Definition of "ready for real users"
All true, signed off in writing:
- [ ] Named Tier-3 owner accountable for the backend.
- [ ] Encryption at rest live; E2E architecture in place (platform cannot read content).
- [ ] KMS/HSM keys; rotation/escrow/loss-recovery documented.
- [ ] Real auth + OTP; tiered identity; session/recovery security.
- [ ] Release engine with cooling + confirmations + admin hold + dispute; reconciliation + monitoring proven.
- [ ] Recipient tokens hashed/expiring/limited; self-destruct destroys/revokes keys.
- [ ] Tamper-evident audit chain.
- [ ] Notification anti-spoofing; Thai Post envelope privacy; DPAs signed.
- [ ] PDPA sign-off from Thai counsel; death-verification workflow + disclaimer reviewed.
- [ ] Security audit + penetration test passed; incident-response + backups/DR ready.
- [ ] Closed beta with consenting test users + monitoring before phased public launch.

Until every box is checked, it remains a synthetic-data prototype.
