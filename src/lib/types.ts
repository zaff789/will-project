// Domain types for The Will (internal: WillVault) prototype.
//
// These model the data contract in PRODUCT.md §7 and SECURITY_HANDOFF.md §5.
// They are the prototype's source of truth and are designed to map cleanly onto
// the real Prisma schema later. Encryption-related fields exist here but resolve
// to STUB values in the prototype — see src/lib/stubs.

// ---------------------------------------------------------------------------
// Enums (string unions)
// ---------------------------------------------------------------------------

export type PackageType = "personal" | "family" | "founder" | "legal_ready";

export type UserRole = "owner" | "member" | "advisor" | "admin" | "recipient";

export type IdentityStatus = "unverified" | "basic_verified" | "kyc_verified";

export type VaultType = "personal" | "family" | "founder";

export type MessageCategory =
  | "memory"
  | "last_message"
  | "confession"
  | "life_instruction"
  | "founder_note"
  | "board_letter"
  | "document_location"
  | "successor_note"
  | "legal_intent";

export type MessageType = "text" | "audio" | "video" | "file" | "mixed";

// How the message behaves once a recipient can reach it.
export type VisibilityMode =
  | "normal"
  | "recipient_only"
  | "one_time"
  | "self_destruct";

// The full creative "mode" surfaced in copy/templates (PRODUCT.md §4).
export type MessageMode =
  | "normal"
  | "recipient_only"
  | "future"
  | "last_message"
  | "memory_capsule"
  | "life_instruction"
  | "founder_note"
  | "one_time"
  | "self_destruct"
  | "legal_intent_note";

export type MessageStatus =
  | "draft"
  | "sealed"
  | "scheduled"
  | "pending_release"
  | "released"
  | "cancelled"
  | "disputed"
  | "destroyed";

export type TriggerType =
  | "date"
  | "inactivity"
  | "trusted_person"
  | "death_verification"
  | "manual_admin";

export type TriggerStatus =
  | "armed"
  | "waiting"
  | "satisfied"
  | "cooling"
  | "held"
  | "fired"
  | "cancelled";

export type SensitivityLevel = "low" | "normal" | "high" | "critical";

export type RecipientType = "person" | "group" | "advisor" | "institution";

export type TrustedPersonRole =
  | "confirmer"
  | "emergency_contact"
  | "witness"
  | "lawyer"
  | "accountant"
  | "advisor";

export type VerificationStatus =
  | "none"
  | "pending"
  | "submitted"
  | "verified"
  | "rejected";

export type AccessStatus = "active" | "used" | "expired" | "revoked" | "destroyed";

// How the recipient is reached/notified at release. secure_link = digital link
// (email/SMS) + OTP; postal = physical letter via Thai Post; trusted_relay = a
// trusted person hands it over. See SECURITY_HANDOFF.md "Recipient delivery".
export type DeliveryChannel =
  | "email"
  | "sms"
  | "secure_link"
  | "postal"
  | "trusted_relay";

export type CheckInStatus = "scheduled" | "sent" | "responded" | "missed";

export type ReleaseStatus =
  | "pending"
  | "cooling"
  | "approved"
  | "released"
  | "blocked";

export type DestructionType =
  | "none"
  | "one_time"
  | "timed"
  | "expire_unopened"
  | "creator_revoke"
  | "admin_hold";

export type CaseStatus =
  | "open"
  | "evidence_requested"
  | "under_review"
  | "approved"
  | "rejected";

export type PackageStatus = "active" | "trial" | "past_due" | "cancelled";

export type EncryptionMode = "stub_server_side" | "stub_e2e_placeholder";

// ---------------------------------------------------------------------------
// Entities (PRODUCT.md §7 / SECURITY_HANDOFF.md §5)
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  date_of_birth: string | null;
  identity_status: IdentityStatus;
  role: UserRole;
}

export interface AccountPackage {
  id: string;
  owner_id: string;
  package_type: PackageType;
  package_status: PackageStatus;
  max_members: number;
  max_recipients: number;
  storage_limit_mb: number;
  renews_at: string | null;
}

export interface PackageMember {
  id: string;
  account_package_id: string;
  user_id: string;
  member_role: UserRole;
  status: "invited" | "active" | "removed";
}

export interface Vault {
  id: string;
  account_package_id: string;
  owner_id: string;
  name: string;
  vault_type: VaultType;
  status: "active" | "archived";
}

export interface Recipient {
  id: string;
  owner_id: string;
  full_name: string;
  email: string;
  phone: string;
  relationship: string;
  recipient_type: RecipientType;
  identity_required: boolean;
}

export interface TrustedPerson {
  id: string;
  owner_id: string;
  full_name: string;
  contact: string;
  role: TrustedPersonRole;
  verification_status: VerificationStatus;
}

export interface Message {
  id: string;
  vault_id: string;
  creator_id: string;
  title: string;
  message_category: MessageCategory;
  message_mode: MessageMode;
  message_type: MessageType;
  // Preview text only — in a real build this would be ciphertext the platform
  // cannot read. Here it is obviously-synthetic plaintext for the demo.
  body_preview: string;

  // Encryption contract fields — STUB values in the prototype.
  encryption_mode: EncryptionMode;
  encrypted_payload_url: string | null;
  encrypted_key_package: string | null;
  content_hash: string | null;

  visibility_mode: VisibilityMode;
  sensitivity_level: SensitivityLevel;
  legal_intent_type: string | null;
  status: MessageStatus;

  allow_download: boolean;
  allow_forwarding: boolean;
  watermark_enabled: boolean;
  recipient_identity_required: boolean;
  creator_can_revoke: boolean;
  platform_access_allowed: boolean;

  created_at: string;
  sealed_at: string | null;
  released_at: string | null;
  destroyed_at: string | null;
}

export interface MessageRecipient {
  id: string;
  message_id: string;
  recipient_id: string;
  delivery_channel: DeliveryChannel;
  access_status: AccessStatus;
  opened_at: string | null;
}

export interface TriggerRule {
  id: string;
  message_id: string;
  trigger_type: TriggerType;
  release_datetime: string | null;
  inactivity_days: number | null;
  checkin_frequency_days: number | null;
  cooling_period_days: number;
  required_confirmations: number;
  manual_approval_required: boolean;
  trusted_person_id: string | null;
  status: TriggerStatus;
}

export interface CheckIn {
  id: string;
  user_id: string;
  trigger_rule_id: string;
  sent_at: string;
  response_deadline: string;
  responded_at: string | null;
  status: CheckInStatus;
}

export interface RecipientAccessToken {
  id: string;
  message_id: string;
  recipient_id: string;
  token_hash: string; // STUB — fake hash, never a real secret
  token_demo: string; // demo-only plaintext slug so links work in the prototype
  expires_at: string | null;
  opened_at: string | null;
  open_count: number;
  max_open_count: number;
  status: AccessStatus;
}

export interface VerificationCase {
  id: string;
  trigger_rule_id: string;
  case_type: TriggerType;
  submitted_by: string;
  evidence_file_url: string | null;
  status: CaseStatus;
  admin_notes: string;
  created_at: string;
  resolved_at: string | null;
}

export interface ReleaseEvent {
  id: string;
  message_id: string;
  trigger_rule_id: string;
  verification_case_id: string | null;
  release_status: ReleaseStatus;
  released_at: string | null;
}

export interface DestructionEvent {
  id: string;
  message_id: string;
  recipient_id: string | null;
  destruction_type: DestructionType;
  reason: string;
  destroyed_at: string;
  proof_hash: string; // STUB
}

export interface AuditLog {
  id: string;
  actor: string;
  entity_type: string;
  entity_id: string;
  action: string;
  metadata_json: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Aggregate store shape
// ---------------------------------------------------------------------------

export interface WillDataset {
  users: User[];
  packages: AccountPackage[];
  packageMembers: PackageMember[];
  vaults: Vault[];
  recipients: Recipient[];
  trustedPersons: TrustedPerson[];
  messages: Message[];
  messageRecipients: MessageRecipient[];
  triggerRules: TriggerRule[];
  checkIns: CheckIn[];
  accessTokens: RecipientAccessToken[];
  verificationCases: VerificationCase[];
  releaseEvents: ReleaseEvent[];
  destructionEvents: DestructionEvent[];
  auditLogs: AuditLog[];
}
