# PRODUCT.md — The Will

The single source of truth for *what* we are building. Distilled from the
business plan and Claude Code build plan. Build flows from this; do not
re-derive product logic elsewhere.

---

## 1. Positioning

**The Will is an encrypted vault for memories, final messages, private
instructions, and important intentions — released only to the right people, at
the right time, under the right conditions.**

It is built on one idea: **a single encrypted conditional message engine.**
Different packages only change purpose, format, templates, seats, and
communication. It is *not* a "secret app" and *not* an "online will app."

**Legal positioning (load-bearing — see `CONTENT.md` for exact disclaimer text):**
The Will is **not** a formal/legally-executed will and does not replace legal
advice. It is a secure legacy-message, memory, life-instruction, and
evidence-of-intent vault. Formal legal features only come later, through
qualified professionals.

---

## 2. The universal engine — every message has 6 dimensions

| Dimension | Question |
| --- | --- |
| Content | What do you want to leave? |
| Recipient | Who can open it? |
| Trigger | When can it open? |
| Verification | What proof is required? |
| Privacy | Who can decrypt/read it? |
| Destruction | What happens after opening? |

Model the message-creation flow as filling in these six dimensions, in this
order, with package-appropriate templates layered on top.

---

## 3. Packages (format, not architecture)

| | Personal | Family Legacy | Founder Continuity |
| --- | --- | --- | --- |
| Seats | 1 user | 2–4 family users | 1 founder + 2–4 advisors |
| Core use | private/future/last/self-destruct messages | parent→child, spouse, elderly memories, family instructions | emergency instruction, board/shareholder letters, advisor map, doc-location checklist, successor note |
| Templates | simple | family templates | founder/business templates |
| Trusted person | optional | important | important |
| Multi-user | no | yes | yes |

**Lead commercial story:** Family Legacy (emotional, understandable, marketable).
**Premium expansion:** Founder Continuity (higher willingness to pay).
**Future partner layer:** Legal-Ready add-on (insurance, banks, law firms) — out of scope for this prototype.

> Key rule repeated: **package controls seats/templates/limits/billing only.
> Message access is always per-message.**

---

## 4. Message modes

`normal` · `recipient-only` · `future` · `last message` · `memory capsule` ·
`life instruction` · `founder note` · `one-time` · `self-destruct` ·
`legal-intent note`

## 5. Trigger types (prototype: all simulated)

| Trigger | Meaning | Prototype behavior |
| --- | --- | --- |
| Date | Release on a future date | "Time machine" advances to the date |
| Inactivity | User misses check-ins | Simulate missed check-in → escalation |
| Trusted person | A trusted person reports an event | Manual button in demo |
| Death verification | Manual review (later/real-build) | Simulated manual approval only |
| Manual admin | Support/testing release | Admin panel button |

## 6. Self-destruct rules

No destruction · one-time open (destroyed after first open) · timed access
(open window) · expire if unopened · creator revoke before trigger · admin hold
on dispute.

> Honest limitation to surface in copy: the system **cannot** prevent
> screenshots or screen recording. It reduces risk via watermark, time limits,
> access logs, and no-download mode. Do not overclaim.

---

## 7. Data model (design contract)

These entities define the shape of the system. In the prototype, model them as
**TypeScript types + a synthetic in-memory store**. The full Prisma schema lives
in `SECURITY_HANDOFF.md` as the contract for the real backend.

Entities: `User` · `AccountPackage` · `PackageMember` · `Vault` · `Recipient` ·
`TrustedPerson` · `Message` · `MessageRecipient` · `TriggerRule` · `CheckIn` ·
`RecipientAccessToken` · `VerificationCase` · `ReleaseEvent` · `DestructionEvent`
· `AuditLog`.

Key field notes for the prototype:
- `Message`: title, `message_category`, `message_type` (text/audio/video/file/mixed), `visibility_mode` (normal/recipient_only/one_time/self_destruct), `status` (draft→sealed→scheduled→pending_release→released→destroyed), `allow_download`, `watermark_enabled`, `recipient_identity_required`, `creator_can_revoke`. Encryption fields exist in the schema but resolve to **stub values** in the prototype.
- `RecipientAccessToken`: `token_hash`, `expires_at`, `open_count`, `max_open_count`, `status`. In the prototype, tokens are fake but the *lifecycle* (active→used/expired/revoked/destroyed) must be faithfully simulated.
- `AuditLog`: log every meaningful action to the mock store so the admin view and the "audit trail" promise are demonstrable.

---

## 8. Synthetic personas (seed data)

Seed the store with clearly-fake personas so flows demo end to end. Example set
(invent more as needed, all obviously fictional):
- **Personal:** "Anan" — leaves a one-time apology to an old friend, date-triggered.
- **Family:** "The Somchai family" — mother records a memory capsule for two children; spouse-to-spouse last message; each message has its own privacy rule.
- **Founder:** "Khun Ploy, SME owner" — emergency instruction to one advisor + a board letter + a document-location checklist.

Every persona is fictional. No real names, emails, or phone numbers.

---

## 9. In scope vs out of scope (this prototype)

**In scope:** auth shell (mock), packages, vaults, recipients, trusted persons,
message creation across all 6 dimensions, simulated triggers + release, recipient
viewer with OTP/watermark/expiry/self-destruct, metadata-only admin view, family
+ founder templates, disclaimers, audit trail (mock).

**Out of scope (do not build):** real encryption, real auth/eKYC, real
email/SMS, live database with real data, payment, formal legal will, government
death registry, blockchain, asset transfer, financial execution.

---

## 10. Recipient delivery & notification

**Recipients do NOT need an account.** Access is via a single-purpose secure link
→ OTP → viewer (see the recipient experience). The hard problem is *notification*:
reaching the receiver credibly at release — possibly years later, when the sender
is gone and cannot introduce it.

**Two real challenges:**
1. **Stale contact / reach** — emails and phones go dead over years; death/inactivity
   triggers fire exactly when the sender can no longer update them.
2. **The scam/trust problem** — "a message from someone who died, click this link,
   enter a code" looks exactly like phishing. Cold digital links are distrusted,
   especially by elderly Thai recipients. This is the biggest adoption risk.

**Delivery channels (chosen per message-recipient; `MessageRecipient.delivery_channel`):**

| Channel | Reach | Credibility | Best for |
| --- | --- | --- | --- |
| `secure_link` (email/SMS + OTP) | high, instant | low (phishing-like) | date/future messages where the sender can pre-warn |
| `postal` (ไปรษณีย์ไทย physical letter, registered/EMS) | high; addresses fairly stable; reaches non-digital elders | **very high** — tangible, official, signature-on-delivery | family/last-words, elderly recipients, anything needing trust |
| `trusted_relay` (a `TrustedPerson` hands it over) | human, adaptive | **highest** — personal | death/inactivity; handling stale contact |

**Recommended model:** layered, multi-channel, no account. Open with secure link +
OTP; offer **Thai Post** as the premium credibility/reach layer (a dignified letter
with an access code — solves the scam problem, reaches elders; registered mail's
signature is a soft identity check; also a natural distribution partnership); use a
**trusted person** as the human fallback for death/inactivity.

**Must design for:**
- **Envelope privacy** (critical for secret/witness): the physical envelope reveals
  nothing — not contents, ideally not the sender. Mail can be opened by others.
- **PDPA**: a physical **address** is extra sensitive PII — consent, retention, deletion.
- **Timing**: postal mailing is *triggered by the release engine* only after the
  trigger is genuinely satisfied (no wrongful mailing).
- **Identity tier**: high-stakes messages (legal/witness) may require `kyc_verified`
  before release.

In the prototype these channels are selectable in message creation and recorded on
the mock store + audit log; nothing is actually sent (`NotificationService` is a stub).
