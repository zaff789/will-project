# SECURITY_HANDOFF.md — The Will

**Audience:** the qualified engineer / technical partner who will own the real
backend. This document defines what the prototype deliberately *did not* build,
and what "done right" requires before a single real user touches the system.

The prototype proves the experience on synthetic data. Everything in this
document is the part the prototype **stubbed** and a non-developer must not ship.

---

## 1. Why a real owner is non-negotiable

The Will stores the most sensitive category of personal data — final messages,
confessions, family instructions, founder continuity — with **irreversible**
release logic (death-triggered, one-time, self-destruct). Failure modes are not
"patch on Monday": a wrongful release or a breach is permanent harm to a
vulnerable person and an existential legal event for the company.

The Phase 3 distribution partners (insurance, banks, wealth management, law
firms) will require security audits, penetration testing, and data-protection
compliance as a condition of distribution. This work is table stakes, not polish.

---

## 2. Modules the prototype stubbed (must be real here)

| Stub interface | Real requirement |
| --- | --- |
| `EncryptionService` | Content encrypted at rest; MVP server-side, **architected for end-to-end** (browser-side encrypt, server stores ciphertext only, platform cannot read content). |
| `KeyService` | Real key management (KMS/HSM-backed). Keys released only after a verified trigger. Define key rotation, escrow, and loss-recovery policy. |
| `AuthService` | Real authentication; recipient OTP; tiered identity (`unverified` / `basic_verified` / `kyc_verified`); session and account-recovery security. |
| `ReleaseEngine` | The trigger + release pipeline: date/inactivity/trusted-person/death-verification/manual, with cooling periods, required confirmations, and admin hold. This is the highest-risk subsystem — wrongful or missed release is the core danger. |
| `AuditService` | Tamper-evident audit log (hash chain). Every access, release, and destruction event recorded immutably. |
| `NotificationService` | Real email/SMS with deliverability, anti-spoofing, and rate limits. |
| `BillingService` | Payment + subscription, package limits, renewal. |

---

## 3. Threat model — what must hold true

- **Platform-read resistance:** the company should be technically unable to casually read private content (admins see metadata only). End-to-end is the target.
- **No wrongful release:** no message opens before its trigger is genuinely satisfied. Inactivity and death-verification need confirmation + cooling period + dispute hold to avoid false positives.
- **No missed release:** the inverse failure — a last message that never fires — is just as serious. Define monitoring and reconciliation.
- **Recipient-only access:** access tokens are single-purpose, hashed, expiring, open-count-limited, and revocable.
- **Destruction is real:** self-destruct revokes the access token, marks destroyed, destroys/revokes the key where possible, writes a `DestructionEvent` + `AuditLog`. Do not rely on file deletion alone.
- **Honest limits:** screenshots/recording cannot be fully prevented — mitigate (watermark, time limits, no-download, logging) and say so in copy.

---

## 4. Compliance & legal (Thailand)

- **PDPA** — highly sensitive personal data; lawful basis, consent, data-subject rights, breach notification, retention/deletion policy, cross-border transfer rules (relevant if cloud storage is offshore).
- **Death-verification liability** — releasing on reported death is legally fraught. Define the manual verification workflow, evidence requirements, dispute handling, and what the company will *not* attest to.
- **Will/estate positioning** — keep the "not a legal will" disclaimer enforced in product (onboarding + sealing). Legal-Ready features require qualified professionals.
- Engage a Thai data-protection / tech lawyer before launch, not after.

---

## 5. Data contract — Prisma schema (target backend)

The prototype models these as TypeScript types over a synthetic store. The real
backend should implement this schema. Source: the uploaded build plan.

**Enums:** packageType (personal|family|founder|legal_ready), messageCategory,
messageStatus (draft|sealed|scheduled|pending_release|released|cancelled|disputed|destroyed),
triggerType (date|inactivity|trusted_person|death_verification|manual_admin),
accessStatus, verificationStatus, releaseStatus, destructionType, userRole.

**Models** (key fields; full field lists in the uploaded plan, sections 14 & 17):

- **User** — email, phone, full_name, date_of_birth, identity_status, role.
- **AccountPackage** — owner, package_type, package_status, max_members, max_recipients, storage_limit_mb.
- **PackageMember** — account_package, user, member_role, status.
- **Vault** — account_package, owner, name, vault_type, status.
- **Recipient** — owner, full_name, email, phone, relationship, recipient_type, identity_required.
- **TrustedPerson** — owner, full_name, contact, role (confirmer|emergency_contact|witness|lawyer|accountant|advisor), verification_status.
- **Message** — vault, creator, title, message_category, message_type, **encryption_mode / encrypted_payload_url / encrypted_key_package / content_hash**, visibility_mode, sensitivity_level, legal_intent_type, status, allow_download, allow_forwarding, watermark_enabled, recipient_identity_required, creator_can_revoke, platform_access_allowed, sealed_at / released_at / destroyed_at.
- **MessageRecipient** — message, recipient, delivery_channel, access_status, opened_at.
- **TriggerRule** — message, trigger_type, release_datetime, inactivity_days, checkin_frequency_days, cooling_period_days, required_confirmations, manual_approval_required, status.
- **CheckIn** — user, trigger_rule, sent_at, response_deadline, responded_at, status.
- **RecipientAccessToken** — message, recipient, token_hash, expires_at, opened_at, open_count, max_open_count, status.
- **VerificationCase** — trigger_rule, case_type, submitted_by, evidence_file_url, status, admin_notes, resolved_at.
- **ReleaseEvent** — message, trigger_rule, verification_case, release_status, released_at.
- **DestructionEvent** — message, recipient, destruction_type, reason, destroyed_at, proof_hash.
- **AuditLog** — actor, entity_type, entity_id, action, metadata_json, ip_address, user_agent, created_at.

Indexes: userId, messageId, vaultId, trigger status, access-token hash.

---

## 6. Build order for the real backend (post-prototype)

Architecture → Prisma schema → folder structure → auth → packages → vaults →
recipients → trusted persons → message creation → **encryption service (real)** →
trigger rules → date-trigger worker → inactivity check-in worker → recipient
access token → secure recipient viewer → self-destruct logic → **audit hash
chain** → admin dashboard → templates → billing.

**Never build (per current scope):** formal legal will, government death-registry
integration, blockchain, asset transfer, eKYC, financial execution.

---

## 7. Questions to vet a technical partner

- Have you built a system handling sensitive personal data under PDPA/GDPR? Examples?
- How would you design key management so the platform cannot read content?
- How do you prevent *both* wrongful release and missed release in a trigger engine?
- What's your audit, pen-test, and incident-response posture?
- Who owns liability if a message releases wrongly or data leaks?
- Are you willing to own the backend as a named, accountable party (the Tier 3 requirement)?

If a candidate hand-waves any of these, they are not the owner this product needs.

---

## 8. Recipient delivery & notification (the last mile)

Access for recipients is **account-free**: a single-purpose, hashed, expiring,
open-count-limited `RecipientAccessToken` → OTP → viewer. The unsolved-by-software
problem is **notifying the recipient credibly** at release. The real owner must
design this; `NotificationService` is only the transport.

**Threats specific to delivery:**
- **Impersonation / phishing** — a release notice ("someone left you a message,
  click here, enter this code") is indistinguishable from a scam. Cold email/SMS
  links will be distrusted, especially by elderly Thai recipients. Mitigate with
  out-of-band trust: physical mail, a trusted-person relay, and consistent,
  verifiable sender identity.
- **Stale contact** — channels rot over the (possibly multi-year) horizon. Define
  reconciliation, periodic contact-refresh, and fallbacks.
- **Wrong-hands delivery** — a household member opens a physical letter, or a shared
  inbox receives the link. Couple notification with the OTP/identity gate so the
  *notification* never exposes content.

**Channels to implement (`DeliveryChannel`): `secure_link` | `postal` | `trusted_relay`**
- **`postal` (Thai Post / ไปรษณีย์ไทย):** a fulfillment integration triggered by the
  release engine. Use **registered/EMS** for delivery confirmation + signature (a
  soft identity check). **Envelope privacy is mandatory** — the outside must reveal
  neither contents nor (for secret/witness cases) the sender. Mailing must fire
  **only after** the trigger is genuinely satisfied (tie to the release pipeline +
  cooling/hold). This is a distribution-partner relationship, with an SLA and a
  data-processing agreement.
- **`trusted_relay`:** notify the verified `TrustedPerson`, who personally delivers
  access. Highest trust; define their authentication and the audit trail.
- **`secure_link`:** anti-spoofing (DKIM/DMARC/SPF), branded verifiable sender,
  rate limits, and a recipient-side "is this real?" verification path.

**Compliance additions:**
- A recipient **physical address** is additional sensitive PII under **PDPA** —
  lawful basis, consent, retention/deletion, and cross-border rules if mail
  fulfillment or storage is offshore.
- **Identity tiering at release:** high-sensitivity messages (legal/witness) should
  require a stronger tier (`kyc_verified`) before the token is honored.

**Prototype status:** channels are selectable in message creation and recorded on
the mock store + `AuditLog`. Nothing is sent — never wire `postal`/`secure_link`/
`trusted_relay` to a real address, carrier, or person in this build.
