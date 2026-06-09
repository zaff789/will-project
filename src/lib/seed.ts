// Synthetic seed data for The Will prototype.
//
// EVERY persona here is fictional (PRODUCT.md §8). No real names, emails, or
// phone numbers. Emails use the reserved .test TLD; phones are obviously fake.
// This is the only data the prototype ever holds.

import type { WillDataset } from "./types";

// A fixed simulated "now" for deterministic demos. The time-machine panel
// (slice 6) moves a separate clock; this is just when the seed was authored.
export const SEED_NOW = "2026-06-09T09:00:00+07:00";

function iso(days: number, base = SEED_NOW): string {
  return new Date(new Date(base).getTime() + days * 86_400_000).toISOString();
}

export function buildSeed(): WillDataset {
  return {
    users: [
      // Personal persona
      {
        id: "u_anan",
        email: "anan@example.test",
        phone: "080-000-0001",
        full_name: "อนันต์ (ตัวอย่าง)",
        date_of_birth: "1984-03-12",
        identity_status: "basic_verified",
        role: "owner",
      },
      // Family persona — mother + father are the 2 seats
      {
        id: "u_malee",
        email: "malee@example.test",
        phone: "080-000-0002",
        full_name: "มาลี สมชาย (ตัวอย่าง)",
        date_of_birth: "1971-07-02",
        identity_status: "basic_verified",
        role: "owner",
      },
      {
        id: "u_somchai",
        email: "somchai@example.test",
        phone: "080-000-0003",
        full_name: "สมชาย ใจดี (ตัวอย่าง)",
        date_of_birth: "1969-11-20",
        identity_status: "unverified",
        role: "member",
      },
      // Founder persona
      {
        id: "u_ploy",
        email: "ploy@example.test",
        phone: "080-000-0004",
        full_name: "พลอย เจ้าของกิจการ (ตัวอย่าง)",
        date_of_birth: "1980-01-09",
        identity_status: "kyc_verified",
        role: "owner",
      },
      // Operator
      {
        id: "u_admin",
        email: "ops@example.test",
        phone: "080-000-0009",
        full_name: "ผู้ดูแลระบบ (ตัวอย่าง)",
        date_of_birth: null,
        identity_status: "kyc_verified",
        role: "admin",
      },
    ],

    packages: [
      {
        id: "pkg_personal",
        owner_id: "u_anan",
        package_type: "personal",
        package_status: "active",
        max_members: 1,
        max_recipients: 5,
        storage_limit_mb: 500,
        renews_at: iso(120),
      },
      {
        id: "pkg_family",
        owner_id: "u_malee",
        package_type: "family",
        package_status: "active",
        max_members: 4,
        max_recipients: 15,
        storage_limit_mb: 2000,
        renews_at: iso(200),
      },
      {
        id: "pkg_founder",
        owner_id: "u_ploy",
        package_type: "founder",
        package_status: "active",
        max_members: 5,
        max_recipients: 20,
        storage_limit_mb: 5000,
        renews_at: iso(60),
      },
    ],

    packageMembers: [
      { id: "pm_1", account_package_id: "pkg_personal", user_id: "u_anan", member_role: "owner", status: "active" },
      { id: "pm_2", account_package_id: "pkg_family", user_id: "u_malee", member_role: "owner", status: "active" },
      { id: "pm_3", account_package_id: "pkg_family", user_id: "u_somchai", member_role: "member", status: "active" },
      { id: "pm_4", account_package_id: "pkg_founder", user_id: "u_ploy", member_role: "owner", status: "active" },
    ],

    vaults: [
      { id: "v_anan", account_package_id: "pkg_personal", owner_id: "u_anan", name: "พื้นที่ส่วนตัวของอนันต์", vault_type: "personal", status: "active" },
      { id: "v_family", account_package_id: "pkg_family", owner_id: "u_malee", name: "ความทรงจำครอบครัวสมชาย", vault_type: "family", status: "active" },
      { id: "v_founder", account_package_id: "pkg_founder", owner_id: "u_ploy", name: "ความต่อเนื่องของกิจการ", vault_type: "founder", status: "active" },
    ],

    recipients: [
      { id: "r_wichai", owner_id: "u_anan", full_name: "วิชัย เพื่อนเก่า (ตัวอย่าง)", email: "wichai@example.test", phone: "081-000-0010", relationship: "เพื่อนเก่า", recipient_type: "person", identity_required: true },
      { id: "r_nin", owner_id: "u_malee", full_name: "นิน ลูกสาว (ตัวอย่าง)", email: "nin@example.test", phone: "081-000-0011", relationship: "ลูกสาว", recipient_type: "person", identity_required: true },
      { id: "r_beam", owner_id: "u_malee", full_name: "บีม ลูกชาย (ตัวอย่าง)", email: "beam@example.test", phone: "081-000-0012", relationship: "ลูกชาย", recipient_type: "person", identity_required: true },
      { id: "r_somchai", owner_id: "u_malee", full_name: "สมชาย คู่ชีวิต (ตัวอย่าง)", email: "somchai@example.test", phone: "080-000-0003", relationship: "คู่ชีวิต", recipient_type: "person", identity_required: true },
      { id: "r_surasak", owner_id: "u_ploy", full_name: "สุรศักดิ์ ที่ปรึกษา (ตัวอย่าง)", email: "surasak@example.test", phone: "081-000-0013", relationship: "ที่ปรึกษาอาวุโส", recipient_type: "advisor", identity_required: true },
      { id: "r_board", owner_id: "u_ploy", full_name: "คณะกรรมการบริษัท (ตัวอย่าง)", email: "board@example.test", phone: "081-000-0014", relationship: "คณะกรรมการ", recipient_type: "group", identity_required: true },
    ],

    trustedPersons: [
      { id: "tp_doctor", owner_id: "u_malee", full_name: "นพ.ธีระ (ตัวอย่าง)", contact: "081-000-0020", role: "confirmer", verification_status: "verified" },
      { id: "tp_lawyer", owner_id: "u_ploy", full_name: "ทนายวรา (ตัวอย่าง)", contact: "081-000-0021", role: "lawyer", verification_status: "verified" },
      { id: "tp_accountant", owner_id: "u_ploy", full_name: "คุณกานต์ นักบัญชี (ตัวอย่าง)", contact: "081-000-0022", role: "accountant", verification_status: "pending" },
    ],

    messages: [
      // Personal — one-time apology, date-triggered
      {
        id: "m_apology",
        vault_id: "v_anan",
        creator_id: "u_anan",
        title: "คำขอโทษที่ค้างคาใจ",
        message_category: "confession",
        message_mode: "one_time",
        message_type: "text",
        body_preview:
          "ถึงวิชัย — มีบางอย่างที่พี่อยากบอกมานานแล้ว วันนั้นพี่ผิดเอง...",
        encryption_mode: "stub_server_side",
        encrypted_payload_url: "stub://payload/m_apology",
        encrypted_key_package: "STUB-KEYPKG-m_apology",
        content_hash: "stub-sha256-apology",
        visibility_mode: "one_time",
        sensitivity_level: "high",
        legal_intent_type: null,
        status: "scheduled",
        allow_download: false,
        allow_forwarding: false,
        watermark_enabled: true,
        recipient_identity_required: true,
        creator_can_revoke: true,
        platform_access_allowed: false,
        created_at: iso(-20),
        sealed_at: iso(-18),
        released_at: null,
        destroyed_at: null,
      },
      // Family — memory capsule for two children
      {
        id: "m_capsule",
        vault_id: "v_family",
        creator_id: "u_malee",
        title: "ถึงนินและบีม วันที่ลูกโตขึ้น",
        message_category: "memory",
        message_mode: "memory_capsule",
        message_type: "mixed",
        body_preview:
          "แม่บันทึกเสียงนี้ไว้ตอนที่ลูกยังเล็ก อยากให้ลูกได้ฟังเมื่อโตขึ้น...",
        encryption_mode: "stub_server_side",
        encrypted_payload_url: "stub://payload/m_capsule",
        encrypted_key_package: "STUB-KEYPKG-m_capsule",
        content_hash: "stub-sha256-capsule",
        visibility_mode: "recipient_only",
        sensitivity_level: "normal",
        legal_intent_type: null,
        status: "sealed",
        allow_download: false,
        allow_forwarding: false,
        watermark_enabled: true,
        recipient_identity_required: true,
        creator_can_revoke: true,
        platform_access_allowed: false,
        created_at: iso(-40),
        sealed_at: iso(-35),
        released_at: null,
        destroyed_at: null,
      },
      // Family — spouse-to-spouse last message (inactivity trigger)
      {
        id: "m_lastmsg",
        vault_id: "v_family",
        creator_id: "u_malee",
        title: "ถึงสมชาย ถ้าฉันไปก่อน",
        message_category: "last_message",
        message_mode: "last_message",
        message_type: "text",
        body_preview:
          "ถ้าวันหนึ่งฉันไม่อยู่แล้ว อยากให้คุณรู้ว่า...",
        encryption_mode: "stub_server_side",
        encrypted_payload_url: "stub://payload/m_lastmsg",
        encrypted_key_package: "STUB-KEYPKG-m_lastmsg",
        content_hash: "stub-sha256-lastmsg",
        visibility_mode: "self_destruct",
        sensitivity_level: "critical",
        legal_intent_type: null,
        status: "pending_release",
        allow_download: false,
        allow_forwarding: false,
        watermark_enabled: true,
        recipient_identity_required: true,
        creator_can_revoke: false,
        platform_access_allowed: false,
        created_at: iso(-60),
        sealed_at: iso(-58),
        released_at: null,
        destroyed_at: null,
      },
      // Founder — emergency instruction to advisor
      {
        id: "m_emergency",
        vault_id: "v_founder",
        creator_id: "u_ploy",
        title: "คำสั่งฉุกเฉินถึงที่ปรึกษา",
        message_category: "life_instruction",
        message_mode: "founder_note",
        message_type: "text",
        body_preview:
          "ถ้าผมติดต่อไม่ได้เกินกำหนด ให้สุรศักดิ์ดำเนินการตามขั้นตอนนี้...",
        encryption_mode: "stub_server_side",
        encrypted_payload_url: "stub://payload/m_emergency",
        encrypted_key_package: "STUB-KEYPKG-m_emergency",
        content_hash: "stub-sha256-emergency",
        visibility_mode: "recipient_only",
        sensitivity_level: "critical",
        legal_intent_type: null,
        status: "sealed",
        allow_download: false,
        allow_forwarding: false,
        watermark_enabled: true,
        recipient_identity_required: true,
        creator_can_revoke: true,
        platform_access_allowed: false,
        created_at: iso(-15),
        sealed_at: iso(-14),
        released_at: null,
        destroyed_at: null,
      },
      // Founder — board / shareholder letter
      {
        id: "m_board",
        vault_id: "v_founder",
        creator_id: "u_ploy",
        title: "จดหมายถึงคณะกรรมการ",
        message_category: "board_letter",
        message_mode: "founder_note",
        message_type: "text",
        body_preview:
          "เรียนคณะกรรมการ — แผนการสืบทอดและเจตนาของผมต่อบริษัทมีดังนี้...",
        encryption_mode: "stub_server_side",
        encrypted_payload_url: "stub://payload/m_board",
        encrypted_key_package: "STUB-KEYPKG-m_board",
        content_hash: "stub-sha256-board",
        visibility_mode: "recipient_only",
        sensitivity_level: "high",
        legal_intent_type: "intent_letter",
        status: "draft",
        allow_download: false,
        allow_forwarding: false,
        watermark_enabled: true,
        recipient_identity_required: true,
        creator_can_revoke: true,
        platform_access_allowed: false,
        created_at: iso(-3),
        sealed_at: null,
        released_at: null,
        destroyed_at: null,
      },
      // Founder — document-location checklist
      {
        id: "m_doclist",
        vault_id: "v_founder",
        creator_id: "u_ploy",
        title: "ที่เก็บเอกสารสำคัญ",
        message_category: "document_location",
        message_mode: "life_instruction",
        message_type: "file",
        body_preview:
          "รายการที่เก็บเอกสารสำคัญ: โฉนด ตราบริษัท สมุดบัญชี กุญแจตู้เซฟ...",
        encryption_mode: "stub_server_side",
        encrypted_payload_url: "stub://payload/m_doclist",
        encrypted_key_package: "STUB-KEYPKG-m_doclist",
        content_hash: "stub-sha256-doclist",
        visibility_mode: "recipient_only",
        sensitivity_level: "high",
        legal_intent_type: null,
        status: "sealed",
        allow_download: false,
        allow_forwarding: false,
        watermark_enabled: false,
        recipient_identity_required: true,
        creator_can_revoke: true,
        platform_access_allowed: false,
        created_at: iso(-10),
        sealed_at: iso(-9),
        released_at: null,
        destroyed_at: null,
      },
    ],

    messageRecipients: [
      { id: "mr_1", message_id: "m_apology", recipient_id: "r_wichai", delivery_channel: "secure_link", access_status: "active", opened_at: null },
      { id: "mr_2", message_id: "m_capsule", recipient_id: "r_nin", delivery_channel: "secure_link", access_status: "active", opened_at: null },
      { id: "mr_3", message_id: "m_capsule", recipient_id: "r_beam", delivery_channel: "secure_link", access_status: "active", opened_at: null },
      { id: "mr_4", message_id: "m_lastmsg", recipient_id: "r_somchai", delivery_channel: "secure_link", access_status: "active", opened_at: null },
      { id: "mr_5", message_id: "m_emergency", recipient_id: "r_surasak", delivery_channel: "secure_link", access_status: "active", opened_at: null },
      { id: "mr_6", message_id: "m_board", recipient_id: "r_board", delivery_channel: "secure_link", access_status: "active", opened_at: null },
      { id: "mr_7", message_id: "m_doclist", recipient_id: "r_surasak", delivery_channel: "secure_link", access_status: "active", opened_at: null },
    ],

    triggerRules: [
      { id: "tr_apology", message_id: "m_apology", trigger_type: "date", release_datetime: iso(30), inactivity_days: null, checkin_frequency_days: null, cooling_period_days: 0, required_confirmations: 0, manual_approval_required: false, trusted_person_id: null, status: "armed" },
      { id: "tr_capsule", message_id: "m_capsule", trigger_type: "date", release_datetime: iso(365), inactivity_days: null, checkin_frequency_days: null, cooling_period_days: 0, required_confirmations: 0, manual_approval_required: false, trusted_person_id: null, status: "armed" },
      { id: "tr_lastmsg", message_id: "m_lastmsg", trigger_type: "inactivity", release_datetime: null, inactivity_days: 30, checkin_frequency_days: 30, cooling_period_days: 7, required_confirmations: 1, manual_approval_required: true, trusted_person_id: "tp_doctor", status: "waiting" },
      { id: "tr_emergency", message_id: "m_emergency", trigger_type: "trusted_person", release_datetime: null, inactivity_days: null, checkin_frequency_days: null, cooling_period_days: 2, required_confirmations: 1, manual_approval_required: true, trusted_person_id: "tp_lawyer", status: "armed" },
      { id: "tr_doclist", message_id: "m_doclist", trigger_type: "death_verification", release_datetime: null, inactivity_days: null, checkin_frequency_days: null, cooling_period_days: 3, required_confirmations: 2, manual_approval_required: true, trusted_person_id: "tp_lawyer", status: "armed" },
    ],

    checkIns: [
      { id: "ci_1", user_id: "u_malee", trigger_rule_id: "tr_lastmsg", sent_at: iso(-30), response_deadline: iso(-23), responded_at: iso(-29), status: "responded" },
      { id: "ci_2", user_id: "u_malee", trigger_rule_id: "tr_lastmsg", sent_at: iso(-1), response_deadline: iso(6), responded_at: null, status: "sent" },
    ],

    accessTokens: [
      { id: "at_capsule_nin", message_id: "m_capsule", recipient_id: "r_nin", token_hash: "stub-hash-capsule-nin", token_demo: "nin-capsule-2026", expires_at: iso(395), opened_at: null, open_count: 0, max_open_count: 5, status: "active" },
      { id: "at_lastmsg", message_id: "m_lastmsg", recipient_id: "r_somchai", token_hash: "stub-hash-lastmsg", token_demo: "somchai-last-2026", expires_at: iso(14), opened_at: null, open_count: 0, max_open_count: 1, status: "active" },
    ],

    verificationCases: [],

    releaseEvents: [],

    destructionEvents: [],

    auditLogs: [
      { id: "al_1", actor: "u_malee", entity_type: "Message", entity_id: "m_capsule", action: "message.sealed", metadata_json: { vault: "v_family" }, ip_address: "10.0.0.1", user_agent: "prototype", created_at: iso(-35) },
      { id: "al_2", actor: "u_ploy", entity_type: "Message", entity_id: "m_emergency", action: "message.sealed", metadata_json: { vault: "v_founder" }, ip_address: "10.0.0.2", user_agent: "prototype", created_at: iso(-14) },
      { id: "al_3", actor: "u_malee", entity_type: "CheckIn", entity_id: "ci_1", action: "checkin.responded", metadata_json: {}, ip_address: "10.0.0.1", user_agent: "prototype", created_at: iso(-29) },
    ],
  };
}
