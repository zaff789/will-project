// Message templates (Slice 8) — the same universal engine, dressed per package.
// A template just pre-fills the 6-dimension creation flow (format, category,
// visibility, trigger); it does NOT change the architecture (PRODUCT.md §3).

import type {
  PackageType,
  MessageType,
  MessageCategory,
  VisibilityMode,
  TriggerType,
} from "./types";

export interface MessageTemplate {
  id: string;
  pkg: PackageType;
  titleTh: string;
  descTh: string;
  format: MessageType;
  category: MessageCategory;
  visibility: VisibilityMode;
  trigger: TriggerType;
}

export const TEMPLATES: MessageTemplate[] = [
  // --- Personal ---
  {
    id: "p_future",
    pkg: "personal",
    titleTh: "ถึงตัวเองในอนาคต",
    descTh: "ข้อความถึงตัวคุณในวันข้างหน้า",
    format: "text",
    category: "memory",
    visibility: "recipient_only",
    trigger: "date",
  },
  {
    id: "p_apology",
    pkg: "personal",
    titleTh: "คำขอโทษที่ค้างคาใจ",
    descTh: "สิ่งที่อยากบอก เปิดได้ครั้งเดียว",
    format: "text",
    category: "confession",
    visibility: "one_time",
    trigger: "date",
  },
  {
    id: "p_secret",
    pkg: "personal",
    titleTh: "ความลับที่เก็บไว้",
    descTh: "เปิดเมื่อถึงเวลา แล้วทำลายตัวเอง",
    format: "text",
    category: "confession",
    visibility: "self_destruct",
    trigger: "inactivity",
  },
  {
    id: "p_loved",
    pkg: "personal",
    titleTh: "ถึงคนที่รัก",
    descTh: "ความรู้สึกดี ๆ ไว้ให้คนสำคัญ",
    format: "video",
    category: "memory",
    visibility: "recipient_only",
    trigger: "date",
  },

  // --- Family ---
  {
    id: "f_milestone",
    pkg: "family",
    titleTh: "ถึงลูก ในวันสำคัญ",
    descTh: "เปิดในวันเรียนจบ แต่งงาน หรือมีลูก",
    format: "text",
    category: "memory",
    visibility: "recipient_only",
    trigger: "date",
  },
  {
    id: "f_capsule",
    pkg: "family",
    titleTh: "แคปซูลความทรงจำ",
    descTh: "บันทึกเสียงหรือวิดีโอเก็บไว้ให้ลูกหลาน",
    format: "video",
    category: "memory",
    visibility: "recipient_only",
    trigger: "date",
  },
  {
    id: "f_lastmsg",
    pkg: "family",
    titleTh: "ข้อความสุดท้ายถึงคู่ชีวิต",
    descTh: "ถ้าวันหนึ่งคุณไม่ได้อยู่บอกเอง",
    format: "text",
    category: "last_message",
    visibility: "recipient_only",
    trigger: "inactivity",
  },
  {
    id: "f_instructions",
    pkg: "family",
    titleTh: "คำแนะนำสำหรับครอบครัว",
    descTh: "เรื่องสำคัญที่ครอบครัวต้องรู้",
    format: "file",
    category: "life_instruction",
    visibility: "recipient_only",
    trigger: "death_verification",
  },

  // --- Founder ---
  {
    id: "fo_emergency",
    pkg: "founder",
    titleTh: "คำสั่งฉุกเฉินถึงทีม",
    descTh: "ขั้นตอนเมื่อผู้ก่อตั้งติดต่อไม่ได้",
    format: "text",
    category: "life_instruction",
    visibility: "recipient_only",
    trigger: "trusted_person",
  },
  {
    id: "fo_board",
    pkg: "founder",
    titleTh: "จดหมายถึงคณะกรรมการ",
    descTh: "เจตนาและแผนต่อบริษัท",
    format: "text",
    category: "board_letter",
    visibility: "recipient_only",
    trigger: "death_verification",
  },
  {
    id: "fo_doclist",
    pkg: "founder",
    titleTh: "ที่เก็บเอกสารสำคัญ",
    descTh: "โฉนด ตราบริษัท บัญชี กุญแจตู้เซฟ",
    format: "file",
    category: "document_location",
    visibility: "recipient_only",
    trigger: "death_verification",
  },
  {
    id: "fo_successor",
    pkg: "founder",
    titleTh: "บันทึกถึงผู้สืบทอด",
    descTh: "สิ่งที่อยากบอกคนที่จะรับช่วงต่อ",
    format: "text",
    category: "successor_note",
    visibility: "recipient_only",
    trigger: "trusted_person",
  },
];
