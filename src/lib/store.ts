"use client";

// In-memory mock store for The Will prototype (CLAUDE.md §3).
// No database, no persistence beyond the browser session. Holds only the
// synthetic dataset from seed.ts. This is the prototype's entire "backend".

import { create } from "zustand";
import type {
  AuditLog,
  WillDataset,
  Message,
  MessageType,
  MessageCategory,
  VisibilityMode,
  TriggerType,
  DeliveryChannel,
  TrustedPersonRole,
} from "./types";
import { buildSeed, SEED_NOW } from "./seed";
import {
  EncryptionService,
  KeyService,
  AuditService,
  ReleaseEngine,
} from "./stubs";

let auditCounter = 1000;
let msgCounter = 0;
let recipientCounter = 0;
let trustedCounter = 0;

// Input for creating a message from the creation wizard (Slice 3).
export interface NewMessageInput {
  vaultId: string;
  creatorId: string;
  title: string;
  body: string;
  format: MessageType;
  category: MessageCategory;
  recipientId: string | null;
  deliveryChannel: DeliveryChannel;
  relayPersonId: string | null; // trusted person, when deliveryChannel = trusted_relay
  triggerType: TriggerType;
  releaseDatetime: string | null;
  visibility: VisibilityMode;
  watermark: boolean;
  allowDownload: boolean;
  identityRequired: boolean;
}

interface WillStore {
  data: WillDataset;

  // Mock-auth: which seeded persona is "logged in".
  currentUserId: string;
  setCurrentUser: (userId: string) => void;

  // Simulated clock for the time-machine panel (slice 6). Defaults to seed now.
  simulatedNow: string;
  setSimulatedNow: (iso: string) => void;
  advanceDays: (days: number) => void;

  // Append a mock audit entry (NOT tamper-proof — see stubs.ts AuditService).
  logAudit: (entry: Omit<AuditLog, "id" | "created_at">) => void;

  // Add a recipient (the "to whom") for a user. Returns the new id.
  addRecipient: (input: {
    ownerId: string;
    fullName: string;
    contact: string;
    relationship: string;
  }) => string;
  removeRecipient: (id: string) => void;

  // Trusted persons (confirmers, emergency contacts, witnesses, advisors…).
  addTrustedPerson: (input: {
    ownerId: string;
    fullName: string;
    contact: string;
    role: TrustedPersonRole;
  }) => string;
  removeTrustedPerson: (id: string) => void;

  // Create + seal a message (Slice 3). Encryption is STUBBED. Returns the new id.
  createMessage: (input: NewMessageInput) => string;

  // Recipient experience (Slice 5) — simulated open + self-destruct lifecycle.
  openMessage: (messageId: string) => void;
  destroyMessage: (messageId: string, reason: string) => void;

  // Time machine (Slice 6) — simulated trigger + release engine.
  fireRelease: (messageId: string) => void; // manual release (trusted/death/admin)
  evaluateDue: () => void; // auto-fire date/inactivity triggers due at simulatedNow

  // Inactivity check-in — "I'm here", resets the inactivity baseline for a user.
  checkInNow: (userId: string) => void;

  // Admin hold (Slice 7) — put a pending release on hold pending review.
  holdTrigger: (messageId: string) => void;

  // Reset everything back to the seeded baseline.
  reset: () => void;
}

export const useWillStore = create<WillStore>((set) => ({
  data: buildSeed(),

  currentUserId: "u_anan",
  setCurrentUser: (userId) => set({ currentUserId: userId }),

  simulatedNow: SEED_NOW,
  setSimulatedNow: (iso) => set({ simulatedNow: iso }),
  advanceDays: (days) =>
    set((s) => ({
      simulatedNow: new Date(
        new Date(s.simulatedNow).getTime() + days * 86_400_000,
      ).toISOString(),
    })),

  logAudit: (entry) =>
    set((s) => ({
      data: {
        ...s.data,
        auditLogs: [
          ...s.data.auditLogs,
          {
            ...entry,
            id: `al_${++auditCounter}`,
            created_at: s.simulatedNow,
          },
        ],
      },
    })),

  addRecipient: (input) => {
    const id = `r_new_${++recipientCounter}`;
    const isEmail = input.contact.includes("@");
    set((s) => ({
      data: {
        ...s.data,
        recipients: [
          ...s.data.recipients,
          {
            id,
            owner_id: input.ownerId,
            full_name: input.fullName,
            email: isEmail ? input.contact : "",
            phone: isEmail ? "" : input.contact,
            relationship: input.relationship,
            recipient_type: "person" as const,
            identity_required: true,
          },
        ],
      },
    }));
    return id;
  },

  removeRecipient: (id) =>
    set((s) => ({
      data: {
        ...s.data,
        recipients: s.data.recipients.filter((r) => r.id !== id),
        messageRecipients: s.data.messageRecipients.filter(
          (mr) => mr.recipient_id !== id,
        ),
      },
    })),

  addTrustedPerson: (input) => {
    const id = `tp_new_${++trustedCounter}`;
    set((s) => ({
      data: {
        ...s.data,
        trustedPersons: [
          ...s.data.trustedPersons,
          {
            id,
            owner_id: input.ownerId,
            full_name: input.fullName,
            contact: input.contact,
            role: input.role,
            verification_status: "pending" as const,
          },
        ],
      },
    }));
    return id;
  },
  removeTrustedPerson: (id) =>
    set((s) => ({
      data: {
        ...s.data,
        trustedPersons: s.data.trustedPersons.filter((t) => t.id !== id),
      },
    })),

  createMessage: (input) => {
    const id = `m_new_${++msgCounter}`;
    // ⚠️ STUB encryption — see stubs.ts. No real cryptography.
    const enc = EncryptionService.encrypt(input.body || input.title);
    set((s) => {
      const now = s.simulatedNow;
      const message: Message = {
        id,
        vault_id: input.vaultId,
        creator_id: input.creatorId,
        title: input.title || "(ไม่มีชื่อ)",
        message_category: input.category,
        message_mode:
          input.visibility === "self_destruct"
            ? "self_destruct"
            : input.visibility === "one_time"
              ? "one_time"
              : "normal",
        message_type: input.format,
        body_preview: input.body.slice(0, 140),
        encryption_mode: "stub_server_side",
        encrypted_payload_url: `stub://payload/${id}`,
        encrypted_key_package: KeyService.issueKeyPackage(id),
        content_hash: enc.contentHash,
        visibility_mode: input.visibility,
        sensitivity_level: "normal",
        legal_intent_type: null,
        status: "sealed",
        allow_download: input.allowDownload,
        allow_forwarding: false,
        watermark_enabled: input.watermark,
        recipient_identity_required: input.identityRequired,
        creator_can_revoke: true,
        platform_access_allowed: false,
        created_at: now,
        sealed_at: now,
        released_at: null,
        destroyed_at: null,
      };
      const manual = ["trusted_person", "death_verification"].includes(
        input.triggerType,
      );
      return {
        data: {
          ...s.data,
          messages: [...s.data.messages, message],
          messageRecipients: input.recipientId
            ? [
                ...s.data.messageRecipients,
                {
                  id: `mr_${id}`,
                  message_id: id,
                  recipient_id: input.recipientId,
                  delivery_channel: input.deliveryChannel,
                  access_status: "active" as const,
                  opened_at: null,
                },
              ]
            : s.data.messageRecipients,
          triggerRules: [
            ...s.data.triggerRules,
            {
              id: `tr_${id}`,
              message_id: id,
              trigger_type: input.triggerType,
              release_datetime: input.releaseDatetime,
              inactivity_days: input.triggerType === "inactivity" ? 30 : null,
              checkin_frequency_days:
                input.triggerType === "inactivity" ? 30 : null,
              cooling_period_days:
                input.triggerType === "death_verification" ? 3 : 0,
              required_confirmations: manual ? 1 : 0,
              manual_approval_required: manual,
              trusted_person_id: null,
              status: "armed" as const,
            },
          ],
          auditLogs: [
            ...s.data.auditLogs,
            {
              id: `al_${++auditCounter}`,
              actor: input.creatorId,
              entity_type: "Message",
              entity_id: id,
              action: "message.sealed",
              metadata_json: {
                visibility: input.visibility,
                trigger: input.triggerType,
                delivery: input.deliveryChannel,
                relay_person: input.relayPersonId,
              },
              ip_address: "10.0.0.1",
              user_agent: "prototype",
              created_at: now,
            },
          ],
        },
      };
    });
    return id;
  },

  openMessage: (messageId) =>
    set((s) => {
      const now = s.simulatedNow;
      return {
        data: {
          ...s.data,
          messages: s.data.messages.map((m) =>
            m.id === messageId && m.status !== "destroyed"
              ? { ...m, released_at: m.released_at ?? now, status: "released" }
              : m,
          ),
          messageRecipients: s.data.messageRecipients.map((mr) =>
            mr.message_id === messageId
              ? { ...mr, opened_at: mr.opened_at ?? now, access_status: "used" }
              : mr,
          ),
          accessTokens: s.data.accessTokens.map((t) =>
            t.message_id === messageId
              ? {
                  ...t,
                  opened_at: t.opened_at ?? now,
                  open_count: t.open_count + 1,
                  status: "used",
                }
              : t,
          ),
          auditLogs: [
            ...s.data.auditLogs,
            {
              id: `al_${++auditCounter}`,
              actor: "recipient",
              entity_type: "Message",
              entity_id: messageId,
              action: "message.opened",
              metadata_json: {},
              ip_address: "10.0.0.5",
              user_agent: "recipient",
              created_at: now,
            },
          ],
        },
      };
    }),

  destroyMessage: (messageId, reason) => {
    KeyService.destroyKey(messageId); // ⚠️ stub — real build revokes/destroys key
    set((s) => {
      const now = s.simulatedNow;
      return {
        data: {
          ...s.data,
          messages: s.data.messages.map((m) =>
            m.id === messageId
              ? { ...m, status: "destroyed", destroyed_at: now }
              : m,
          ),
          accessTokens: s.data.accessTokens.map((t) =>
            t.message_id === messageId ? { ...t, status: "destroyed" } : t,
          ),
          destructionEvents: [
            ...s.data.destructionEvents,
            {
              id: `de_${messageId}`,
              message_id: messageId,
              recipient_id: null,
              destruction_type: "one_time",
              reason,
              destroyed_at: now,
              proof_hash: AuditService.chainHash("", messageId),
            },
          ],
          auditLogs: [
            ...s.data.auditLogs,
            {
              id: `al_${++auditCounter}`,
              actor: "system",
              entity_type: "Message",
              entity_id: messageId,
              action: "message.destroyed",
              metadata_json: { reason },
              ip_address: "10.0.0.5",
              user_agent: "system",
              created_at: now,
            },
          ],
        },
      };
    });
  },

  fireRelease: (messageId) =>
    set((s) => {
      const now = s.simulatedNow;
      const tr = s.data.triggerRules.find((t) => t.message_id === messageId);
      const m = s.data.messages.find((x) => x.id === messageId);
      if (!m || m.status === "released" || m.status === "destroyed") return {};
      return {
        data: {
          ...s.data,
          messages: s.data.messages.map((x) =>
            x.id === messageId ? { ...x, status: "released", released_at: now } : x,
          ),
          triggerRules: s.data.triggerRules.map((t) =>
            t.message_id === messageId ? { ...t, status: "fired" } : t,
          ),
          releaseEvents: [
            ...s.data.releaseEvents,
            {
              id: `re_${messageId}_${++auditCounter}`,
              message_id: messageId,
              trigger_rule_id: tr?.id ?? "",
              verification_case_id: null,
              release_status: "released",
              released_at: now,
            },
          ],
          auditLogs: [
            ...s.data.auditLogs,
            {
              id: `al_${++auditCounter}`,
              actor: "system",
              entity_type: "Message",
              entity_id: messageId,
              action: "message.released",
              metadata_json: { trigger: tr?.trigger_type, manual: true },
              ip_address: "10.0.0.9",
              user_agent: "release-engine",
              created_at: now,
            },
          ],
        },
      };
    }),

  evaluateDue: () =>
    set((s) => {
      const now = s.simulatedNow;
      const due = new Set<string>();
      for (const tr of s.data.triggerRules) {
        const m = s.data.messages.find((x) => x.id === tr.message_id);
        if (!m || m.status === "released" || m.status === "destroyed") continue;
        if (tr.status === "fired") continue;
        if (
          tr.trigger_type === "date" &&
          ReleaseEngine.isDateSatisfied(tr.release_datetime, now)
        ) {
          due.add(tr.message_id);
        }
        if (tr.trigger_type === "inactivity") {
          const lastResponse = s.data.checkIns
            .filter((c) => c.trigger_rule_id === tr.id && c.responded_at)
            .map((c) => c.responded_at as string)
            .sort()
            .pop() ?? null;
          if (
            ReleaseEngine.isInactivityElapsed(
              lastResponse,
              tr.inactivity_days,
              now,
            )
          ) {
            due.add(tr.message_id);
          }
        }
      }
      if (due.size === 0) return {};
      const ids = [...due];
      return {
        data: {
          ...s.data,
          messages: s.data.messages.map((m) =>
            due.has(m.id) ? { ...m, status: "released", released_at: now } : m,
          ),
          triggerRules: s.data.triggerRules.map((t) =>
            due.has(t.message_id) ? { ...t, status: "fired" } : t,
          ),
          releaseEvents: [
            ...s.data.releaseEvents,
            ...ids.map((mid) => ({
              id: `re_${mid}_${++auditCounter}`,
              message_id: mid,
              trigger_rule_id:
                s.data.triggerRules.find((t) => t.message_id === mid)?.id ?? "",
              verification_case_id: null,
              release_status: "released" as const,
              released_at: now,
            })),
          ],
          auditLogs: [
            ...s.data.auditLogs,
            ...ids.map((mid) => ({
              id: `al_${++auditCounter}`,
              actor: "system",
              entity_type: "Message",
              entity_id: mid,
              action: "message.released",
              metadata_json: { auto: true },
              ip_address: "10.0.0.9",
              user_agent: "release-engine",
              created_at: now,
            })),
          ],
        },
      };
    }),

  checkInNow: (userId) =>
    set((s) => {
      const now = s.simulatedNow;
      // Inactivity triggers on this user's messages.
      const vaultIds = new Set(
        vaultsForUser(s.data, userId).map((v) => v.id),
      );
      const myMsgIds = new Set(
        s.data.messages.filter((m) => vaultIds.has(m.vault_id)).map((m) => m.id),
      );
      const triggers = s.data.triggerRules.filter(
        (t) => t.trigger_type === "inactivity" && myMsgIds.has(t.message_id),
      );
      if (triggers.length === 0) return {};
      let n = 9000;
      const newCheckIns = triggers.map((t) => ({
        id: `ci_new_${++n}`,
        user_id: userId,
        trigger_rule_id: t.id,
        sent_at: now,
        response_deadline: now,
        responded_at: now,
        status: "responded" as const,
      }));
      return {
        data: {
          ...s.data,
          checkIns: [...s.data.checkIns, ...newCheckIns],
          auditLogs: [
            ...s.data.auditLogs,
            {
              id: `al_${++auditCounter}`,
              actor: userId,
              entity_type: "CheckIn",
              entity_id: triggers[0].id,
              action: "checkin.responded",
              metadata_json: {},
              ip_address: "10.0.0.1",
              user_agent: "prototype",
              created_at: now,
            },
          ],
        },
      };
    }),

  holdTrigger: (messageId) =>
    set((s) => {
      const now = s.simulatedNow;
      return {
        data: {
          ...s.data,
          triggerRules: s.data.triggerRules.map((t) =>
            t.message_id === messageId ? { ...t, status: "held" } : t,
          ),
          auditLogs: [
            ...s.data.auditLogs,
            {
              id: `al_${++auditCounter}`,
              actor: s.currentUserId,
              entity_type: "TriggerRule",
              entity_id: messageId,
              action: "release.held",
              metadata_json: {},
              ip_address: "10.0.0.9",
              user_agent: "admin",
              created_at: now,
            },
          ],
        },
      };
    }),

  reset: () => set({ data: buildSeed(), simulatedNow: SEED_NOW }),
}));

// ---------------------------------------------------------------------------
// Small selector helpers (pure functions over the dataset).
// ---------------------------------------------------------------------------

export function packageForUser(data: WillDataset, userId: string) {
  const membership = data.packageMembers.find((m) => m.user_id === userId);
  if (!membership) return undefined;
  return data.packages.find((p) => p.id === membership.account_package_id);
}

export function vaultsForUser(data: WillDataset, userId: string) {
  const pkg = packageForUser(data, userId);
  if (!pkg) return [];
  return data.vaults.filter((v) => v.account_package_id === pkg.id);
}

export function messagesForUser(data: WillDataset, userId: string) {
  const vaultIds = new Set(vaultsForUser(data, userId).map((v) => v.id));
  return data.messages.filter((m) => vaultIds.has(m.vault_id));
}
