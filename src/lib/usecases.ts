// Seven reference use cases for the /stories page — a face + a heartfelt story
// each, spanning packages and the 6 message dimensions. Fictional/illustrative
// (synthetic), bilingual. Photos: public/usecases/*.png.

export interface UseCase {
  photo: string;
  name: string;
  age: number;
  scenarioTh: string;
  scenarioEn: string;
  storyTh: string;
  storyEn: string;
  form: string; // message form (Thai · EN)
  trigger: string; // release condition (Thai · EN)
  package: "personal" | "family" | "founder";
}

export const USE_CASES: UseCase[] = [
  {
    photo: "/usecases/1.png",
    name: "มาลี",
    age: 54,
    scenarioTh: "แม่ ถึง ลูก",
    scenarioEn: "A mother, to her children",
    storyTh:
      "มาลีบันทึกเสียงเล่าเรื่องวันที่ลูกยังเล็ก เก็บไว้ให้ลูกได้ฟังในวันที่มีครอบครัวของตัวเอง",
    storyEn:
      "Malee records the stories of when they were small — kept for the day they start a family of their own.",
    form: "บันทึกเสียง · Voice",
    trigger: "ตามวันที่ · On a date",
    package: "family",
  },
  {
    photo: "/usecases/2.png",
    name: "สมชาย",
    age: 61,
    scenarioTh: "สามี ถึง ภรรยา",
    scenarioEn: "A husband, to his wife",
    storyTh:
      "“ถ้าผมไปก่อน อยากให้เธอรู้ว่า…” ข้อความที่จะเปิดก็ต่อเมื่อเขาไม่ได้ตอบกลับการเช็คอินอีกต่อไป",
    storyEn:
      "“If I go first, I want her to know…” — released only if he stops answering his check-ins.",
    form: "ข้อความ · Text",
    trigger: "เมื่อไม่ตอบกลับ · Inactivity",
    package: "family",
  },
  {
    photo: "/usecases/3.png",
    name: "Daniel",
    age: 42,
    scenarioTh: "เพื่อน ถึง เพื่อนเก่า",
    scenarioEn: "A friend, to an old friend",
    storyTh:
      "คำขอโทษที่ค้างคาใจมาสิบปี ตั้งใจให้เปิดอ่านได้เพียงครั้งเดียว แล้วปล่อยให้เป็นอดีต",
    storyEn:
      "A ten-year-overdue apology — meant to be read once, then let go.",
    form: "ข้อความ · Text",
    trigger: "เปิดครั้งเดียว · One-time",
    package: "personal",
  },
  {
    photo: "/usecases/4.png",
    name: "Priya",
    age: 46,
    scenarioTh: "ผู้ก่อตั้ง ถึง ทีมและกรรมการ",
    scenarioEn: "A founder, to her team & board",
    storyTh:
      "ถ้าวันหนึ่ง Priya ติดต่อไม่ได้ ทีมจะเปิดคำสั่งฉุกเฉิน แผนสืบทอด และเจตนาที่มีต่อบริษัทได้",
    storyEn:
      "If Priya ever can't be reached, her team can open the emergency instructions, succession plan, and her intent for the company.",
    form: "ข้อความ + ไฟล์ · Text + File",
    trigger: "ผู้ที่ไว้วางใจยืนยัน · Trusted person",
    package: "founder",
  },
  {
    photo: "/usecases/5.png",
    name: "คุณยายเล็ก",
    age: 78,
    scenarioTh: "ย่า ถึง หลาน",
    scenarioEn: "A grandmother, to her grandchildren",
    storyTh:
      "วิดีโอเล่าเรื่องครอบครัวและคำสอน เพื่อให้หลานได้รู้จักรากเหง้าของตัวเอง ในวันเกิดอายุครบสิบแปด",
    storyEn:
      "A video of family stories and lessons — so the grandchildren know where they come from, opened on their 18th birthday.",
    form: "วิดีโอ · Video",
    trigger: "ตามวันที่ · On a date",
    package: "family",
  },
  {
    photo: "/usecases/6.png",
    name: "Marcus",
    age: 50,
    scenarioTh: "หัวหน้าครอบครัว ถึง ครอบครัว",
    scenarioEn: "A family's anchor, to his family",
    storyTh:
      "ที่เก็บเอกสารสำคัญ กรมธรรม์ และสิ่งที่ครอบครัวต้องรู้ — รวมไว้ที่เดียว เผื่อวันที่เขาไม่อยู่บอกเอง",
    storyEn:
      "Where the documents, policies, and everything the family needs are kept — in one place, for the day he can't tell them himself.",
    form: "ไฟล์ + รายการ · File + checklist",
    trigger: "ยืนยันการเสียชีวิต · Death verification",
    package: "personal",
  },
  {
    photo: "/usecases/7.png",
    name: "Sofia",
    age: 33,
    scenarioTh: "ถึง คนที่อยากบอก",
    scenarioEn: "To someone she wants to tell",
    storyTh:
      "สิ่งที่ไม่เคยได้พูดออกไป เก็บไว้อย่างปลอดภัย ตั้งให้เปิดในวันเกิดปีหน้า เมื่อถึงเวลาที่พร้อม",
    storyEn:
      "Something never said aloud — kept safe, set to open on next year's birthday, when the time is right.",
    form: "ข้อความ · Text",
    trigger: "ในอนาคต · Future date",
    package: "personal",
  },
];
