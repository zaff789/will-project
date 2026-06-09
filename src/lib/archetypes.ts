// The six intents a person might carry into The Will. Each adapts the onboarding
// mood (accent) and implies a release/privacy posture. Used by the "What do you
// carry?" step and the conditional-release visualization.

export type ArchetypeId =
  | "secret"
  | "apology"
  | "legacy"
  | "love"
  | "witness"
  | "reconcile";

export interface Archetype {
  id: ArchetypeId;
  titleTh: string;
  titleEn: string;
  lineTh: string;
  accent: string; // hex — tints the onboarding for this intent
  // The release condition this intent typically implies (for the viz).
  conditionTh: string;
  conditionEn: string;
  privacyTh: string; // how it's guarded
}

export const ARCHETYPES: Archetype[] = [
  {
    id: "secret",
    titleTh: "ความลับ",
    titleEn: "A secret",
    lineTh: "สิ่งที่เก็บไว้คนเดียวมานาน เปิดเมื่อถึงเวลาที่คุณเลือก",
    accent: "#6f6391", // muted violet — private, held close
    conditionTh: "เปิดได้ครั้งเดียว",
    conditionEn: "Opens once, then closes",
    privacyTh: "เฉพาะผู้รับที่ยืนยันตัวตน · ทำลายหลังเปิด",
  },
  {
    id: "apology",
    titleTh: "คำขอโทษ",
    titleEn: "An apology",
    lineTh: "คำที่ไม่ได้พูดออกไป ส่งถึงเขาอย่างนุ่มนวลเมื่อคุณพร้อม",
    accent: "#b06a4f", // terracotta — warm remorse
    conditionTh: "ตามวันที่คุณกำหนด",
    conditionEn: "On a date you choose",
    privacyTh: "เฉพาะผู้รับ · เปิดได้ครั้งเดียว",
  },
  {
    id: "legacy",
    titleTh: "สิ่งที่ต้องสั่งเสีย",
    titleEn: "A legacy to pass on",
    lineTh: "คำสั่ง คำแนะนำ และที่อยู่ของสิ่งสำคัญ ให้คนข้างหลังไม่สับสน",
    accent: "#a9824c", // amber/gold — continuity
    conditionTh: "เมื่อผู้ที่ไว้วางใจยืนยัน",
    conditionEn: "When a trusted person confirms",
    privacyTh: "ปล่อยหลังการยืนยัน + ช่วงพักรอ",
  },
  {
    id: "love",
    titleTh: "ข้อความถึงคนที่รัก",
    titleEn: "A message to loved ones",
    lineTh: "ความทรงจำ คำพูดสุดท้าย เสียงและภาพ ไว้ให้คนที่คุณรัก",
    accent: "#bd7a78", // warm rose — love
    conditionTh: "ในวันสำคัญ หรือเมื่อคุณไม่ตอบกลับ",
    conditionEn: "On a special day, or if you stop checking in",
    privacyTh: "เฉพาะผู้รับ · ส่งด้วยความอบอุ่น",
  },
  {
    id: "witness",
    titleTh: "ความจริงที่ต้องเปิดเผย",
    titleEn: "A truth to reveal",
    lineTh: "สิ่งที่ต้องไม่เงียบหายไป เปิดเผยเมื่อถึงเงื่อนไข — แม้วันหนึ่งคุณพูดเองไม่ได้",
    accent: "#5f8082", // steel-teal — serious, cooler, future-facing
    conditionTh: "เมื่อคุณไม่ตอบกลับ (dead-man's switch)",
    conditionEn: "If you go silent — a dead-man's switch",
    privacyTh: "ปล่อยตามเงื่อนไข · เก็บเป็นหลักฐานที่ตรวจสอบได้",
  },
  {
    id: "reconcile",
    titleTh: "การคืนดี",
    titleEn: "To make peace",
    lineTh: "คำที่อยากบอกก่อนจะสายเกินไป เพื่อปิดบางอย่างด้วยความเข้าใจ",
    accent: "#6f8a6a", // sage — peace
    conditionTh: "ตามวันที่ หรือเมื่อคุณเลือก",
    conditionEn: "On a date, or whenever you choose",
    privacyTh: "เฉพาะผู้รับ · ด้วยความเคารพ",
  },
];

export function archetype(id: ArchetypeId | null): Archetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}
