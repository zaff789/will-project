// User-facing copy for The Will. All strings are Thai (mixed Thai-English where
// natural). Legal / sensitive strings are reproduced VERBATIM from CONTENT.md —
// never machine-translate or paraphrase these. Code & comments stay English.

export const BRAND = {
  marketName: "The Will",
  internalName: "WillVault",
  // Brand line (CONTENT.md §2)
  tagline:
    "เก็บความทรงจำ คำพูดสุดท้าย และสิ่งสำคัญ ไว้ให้คนที่คุณรัก เปิดได้เมื่อถึงเวลาที่เหมาะสม",
  founderLine:
    "ถ้าวันหนึ่งผู้ก่อตั้งพูดไม่ได้ ธุรกิจและครอบครัวต้องไม่สับสน",
  // Constant clarifying line paired with the "The Will" name (CONTENT.md §1)
  clarifier: "พื้นที่เก็บความทรงจำและสิ่งสำคัญ — ไม่ใช่พินัยกรรมตามกฎหมาย",
} as const;

// Legal disclaimer — exact strings from CONTENT.md §3. Shown at onboarding and
// at message sealing. DO NOT paraphrase.
export const DISCLAIMER = {
  th: `The Will ไม่ใช่บริการแทนคำปรึกษาทางกฎหมาย และไม่ใช่พินัยกรรมที่มีผลทางกฎหมาย แต่เป็นพื้นที่เก็บความทรงจำ ข้อความ และเจตนาสำคัญอย่างปลอดภัย เพื่อความไว้วางใจ ความเป็นส่วนตัว และการส่งต่อสิ่งสำคัญให้ครอบครัว หากต้องการจัดทำพินัยกรรมที่มีผลทางกฎหมาย โปรดปรึกษาผู้เชี่ยวชาญด้านกฎหมาย`,
  en: `The Will is not a replacement for formal legal advice or a legally executed will. It is a secure legacy, memory, and intent vault designed to support trust, privacy, family continuity, and responsible planning. To create a legally valid will or estate plan, consult a qualified legal professional.`,
} as const;

// Security-honesty note — shown near self-destruct / no-download settings.
export const SECURITY_HONESTY = {
  th: "ระบบช่วยลดความเสี่ยง แต่ไม่สามารถป้องกันการถ่ายภาพหน้าจอหรือบันทึกหน้าจอได้ทั้งหมด",
  en: "The system reduces risk but cannot fully prevent screenshots or screen recording.",
} as const;

// Microcopy for key moments (CONTENT.md §4).
export const MICROCOPY = {
  seal: {
    heading: "ยืนยันการปิดผนึกข้อความ",
    body: "เมื่อปิดผนึกแล้ว ข้อความนี้จะถูกเก็บอย่างปลอดภัย และจะเปิดได้ตามเงื่อนไขที่คุณกำหนดเท่านั้น",
    confirm: "ปิดผนึกข้อความ",
    cancel: "กลับไปแก้ไข",
  },
  otp: {
    heading: "เพื่อให้แน่ใจว่าเป็นคุณ",
    body: "เราส่งรหัสยืนยันเพื่อปกป้องข้อความนี้ให้เปิดได้เฉพาะคุณ",
  },
  beforeOneTime: {
    heading: "ข้อความนี้เปิดได้เพียงครั้งเดียว",
    body: "เมื่อคุณเปิดแล้ว ข้อความจะปิดและไม่สามารถเปิดได้อีก โปรดเปิดเมื่อคุณพร้อม",
    confirm: "ฉันพร้อมเปิดข้อความ",
  },
  afterSelfDestruct: {
    body: "ข้อความนี้ได้ถูกเปิดและปิดเรียบร้อยแล้ว ขอบคุณที่ดูแลช่วงเวลานี้ด้วยความเข้าใจ",
  },
  checkIn: {
    heading: "คุณยังอยู่กับเราไหม",
    body: "แตะเพื่อยืนยันว่าคุณสบายดี เราจะไม่ส่งข้อความใด ๆ ตราบใดที่คุณยังตอบกลับ",
  },
} as const;

export const PROTOTYPE_BANNER = "PROTOTYPE — ข้อมูลทดสอบเท่านั้น (synthetic data only)";

// Thai labels for enums used across the UI.
export const PACKAGE_LABELS: Record<string, string> = {
  personal: "ส่วนตัว",
  family: "ครอบครัว",
  founder: "ผู้ก่อตั้ง",
  legal_ready: "Legal-Ready",
};

export const CATEGORY_LABELS: Record<string, string> = {
  memory: "ความทรงจำ",
  last_message: "ข้อความสุดท้าย",
  confession: "คำสารภาพ",
  life_instruction: "คำสั่งเสีย / คำแนะนำ",
  founder_note: "บันทึกผู้ก่อตั้ง",
  board_letter: "จดหมายถึงคณะกรรมการ",
  document_location: "ที่เก็บเอกสารสำคัญ",
  successor_note: "บันทึกถึงผู้สืบทอด",
  legal_intent: "เจตนาทางกฎหมาย",
};

export const VISIBILITY_LABELS: Record<string, string> = {
  normal: "ปกติ",
  recipient_only: "เฉพาะผู้รับ",
  one_time: "เปิดได้ครั้งเดียว",
  self_destruct: "ทำลายตัวเองหลังเปิด",
};

export const TRIGGER_LABELS: Record<string, string> = {
  date: "ตามวันที่",
  inactivity: "เมื่อไม่ตอบกลับ",
  trusted_person: "ผู้ที่ไว้วางใจยืนยัน",
  death_verification: "ยืนยันการเสียชีวิต",
  manual_admin: "ผู้ดูแลระบบ",
};

export const STATUS_LABELS: Record<string, string> = {
  draft: "ฉบับร่าง",
  sealed: "ปิดผนึกแล้ว",
  scheduled: "ตั้งเวลาแล้ว",
  pending_release: "รอการเปิด",
  released: "ปล่อยแล้ว",
  cancelled: "ยกเลิก",
  disputed: "มีข้อโต้แย้ง",
  destroyed: "ถูกทำลายแล้ว",
};

export const DELIVERY_LABELS: Record<string, string> = {
  secure_link: "ลิงก์ปลอดภัย",
  email: "อีเมล",
  sms: "SMS",
  postal: "จดหมายไปรษณีย์ไทย",
  trusted_relay: "ผ่านผู้ที่ไว้วางใจ",
};

export const TRUSTED_ROLE_LABELS: Record<string, string> = {
  confirmer: "ผู้ยืนยัน",
  emergency_contact: "ผู้ติดต่อฉุกเฉิน",
  witness: "พยาน",
  lawyer: "ทนายความ",
  accountant: "นักบัญชี",
  advisor: "ที่ปรึกษา",
};
