# SUPABASE_MAPPING.md — Prototype → Supabase (+ Vercel)

**Audience:** the security/backend engineer who will own the real build. Maps the
prototype's data model + stubs onto Supabase primitives. **Boundary still applies:**
nothing goes live with real user data until `REAL_BUILD_ROADMAP.md` §8 gate is met.
This is a build target, not a green light to ship.

---

## Architecture overview
- **Front-end:** the prototype's Next.js app on **Vercel** (keep the UX/flows).
- **Data:** **Supabase Postgres** with **Row-Level Security** (the schema in `SECURITY_HANDOFF.md` §5).
- **Logic:** **Supabase Edge Functions** (Deno) for everything security-critical.
- **Auth:** **Supabase Auth** for owners; **custom Edge-Function OTP** for recipients.
- **Files:** **Supabase Storage** (private buckets) — stores **ciphertext only**.
- **Schedules:** **pg_cron** + **pg_net** (or external scheduler) for release workers.
- **Keys/secrets:** **external KMS** (e.g. AWS KMS) for release keys; **Supabase Vault** / Vercel env for service secrets.
- **Providers (via Edge Functions only):** SMS (Twilio/Vonage), email SMTP (SES/Resend), Thai Post fulfillment, Stripe/Thai PSP.

### The one rule that governs everything
**Clients never touch sensitive tables or secrets directly.** Browser uses the
**anon key** + RLS for owner-scoped, non-secret reads. All sensitive reads/writes
(decryptable payloads, release decisions, audit, notifications) go through **Edge
Functions using the service-role key** (server-side only). RLS is **default-deny**.

---

## A. Entities → tables + RLS posture
(15 prototype types → Postgres tables. RLS keyed on `auth.uid()` = owner.)

| Table | RLS posture |
| --- | --- |
| `users` (profile; mirrors `auth.users`) | self read/update only |
| `account_packages`, `package_members` | members of the package |
| `vaults` | owner / package members |
| `recipients`, `trusted_persons` | owner only |
| `messages` | owner read **metadata**; **ciphertext columns never readable by client** (served via Edge Function) |
| `message_recipients` | owner only |
| `trigger_rules`, `check_ins` | owner only |
| `recipient_access_tokens` | **no client access** — Edge Functions only (hashed tokens) |
| `verification_cases`, `release_events`, `destruction_events` | owner read; writes via Edge Functions |
| `audit_logs` | **append-only**; no client read of others; no update/delete (see §F) |

Admin sees **metadata only** via a dedicated role + views that exclude ciphertext columns.

---

## B. Auth & identity
- **Owner login → Supabase Auth.** Email OTP/magic link (`signInWithOtp`) or phone OTP (configure Twilio/Vonage as the SMS provider; Supabase doesn't send SMS itself). Production email needs custom SMTP.
- **Recipient access → custom OTP (Edge Function).** Recipients have **no Supabase Auth account**. Flow: Edge Function generates a one-time code → **hashes it onto `recipient_access_tokens`** (expiry + attempt counter) → sends via provider (or via Thai Post letter / trusted person) → verify Edge Function checks hash/expiry/attempts → issues a **short-lived, single-message** signed JWT to open just that message. Rate-limit + lockout; no recipient-enumeration leakage.
- **Identity tiers** (`unverified`/`basic_verified`/`kyc_verified`): gate high-sensitivity messages (legal/witness) to require a stronger tier before release.

---

## C. Encryption & keys (the platform-can't-read goal)
- **E2E target:** encrypt **client-side**; Storage/DB hold **ciphertext only** → Supabase (and admins) can't read content. `encrypted_payload_url` → private Storage object; `content_hash` for integrity.
- **KeyService → external KMS** (AWS KMS/HSM) — release keys held there, released only after a verified trigger; define rotation/escrow/loss-recovery. Do **not** rely on `pgsodium` for this (being deprecated; use Vault for secrets, KMS for key custody, client-side keys for E2E).
- Service-role key lives **only** in Edge Functions / server env — never in the browser.

---

## D. Stub → Supabase primitive

| Prototype stub | Real implementation on Supabase |
| --- | --- |
| `EncryptionService` | Client-side crypto (WebCrypto) + Storage (ciphertext). Server never sees plaintext. |
| `KeyService` | External KMS/HSM; keys released post-trigger only. |
| `AuthService` | Supabase Auth (owner) + Edge-Function OTP (recipient). |
| `ReleaseEngine` | pg_cron + Edge Functions as workers + a state machine (see §E). |
| `AuditService` | Append-only `audit_logs` + hash-chain trigger (see §F). |
| `NotificationService` | Edge Functions → SMS/email/Thai Post providers. Never client-side. |
| `BillingService` | Stripe/Thai PSP via Edge Functions + webhooks. |

---

## E. Release engine on Supabase (highest-risk)
- **Date trigger:** `pg_cron` job → Edge Function checks due `trigger_rules` → moves to `pending_release` → cooling/confirmations → `release_events` + key release + recipient notification.
- **Inactivity:** scheduled `check_ins`; missed responses escalate; cooling + trusted-person confirmation before release.
- **Trusted-person / death-verification:** `verification_cases` reviewed (manual/admin), required confirmations, **admin hold + dispute** before release.
- **Both failure modes guarded:** monitoring + reconciliation jobs detect *missed* releases and *wrongful* releases; every transition writes an audit entry. Idempotent workers (no double-fire).

---

## F. Audit hash chain (tamper-evident)
- `audit_logs` append-only: revoke UPDATE/DELETE for app roles; inserts via Edge Function (service role).
- A Postgres trigger computes `hash = H(prev_hash || row)` so any tampering breaks the chain. Periodic export/anchoring for stronger guarantees. (The prototype's `AuditService` is explicitly NOT tamper-proof; this is where it becomes real.)

---

## G. Delivery & notification
- Edge Function chooses channel from `message_recipients.delivery_channel`:
  `secure_link` (email/SMS + OTP), `postal` (Thai Post fulfillment API — registered/EMS, **envelope privacy**, release-triggered), `trusted_relay` (notify the verified trusted person).
- Anti-spoofing (DKIM/DMARC/SPF), rate limits. DPAs with every subprocessor (incl. mail).

---

## H. Secrets & infra
- Service-role key, KMS creds, provider API keys → **Supabase Vault / Vercel env**, server-side only.
- **Data residency:** choose Supabase region for PDPA (TH/SG); document cross-border transfer if mail/providers are offshore.

---

## I. RLS rules of thumb
1. Default-deny; add narrow owner policies (`auth.uid()`).
2. Ciphertext + tokens + secrets: **no client policy at all** → Edge Functions only.
3. Recipients act through signed single-message sessions, not Supabase Auth users.
4. Admin = metadata-only role/views (never ciphertext).

> **Gate reminder:** wiring any of this to a real address/phone/person or real PII
> requires the named security owner + audit + PDPA sign-off first (`REAL_BUILD_ROADMAP.md`).
> The prototype repo stays synthetic + stubbed.
