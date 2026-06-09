// Illustrative example messages — heartfelt, fictional, bilingual. Used as
// emotional inspiration across the UI (landing, dashboard, onboarding). These are
// NOT real testimonials; they are sample messages to convey what The Will is for.

export interface ExampleMessage {
  photo: string;
  to: string;
  toEn: string;
  quote: string;
  quoteEn: string;
}

export const EXAMPLE_MESSAGES: ExampleMessage[] = [
  {
    photo: "/hero/3.png",
    to: "ถึงลูกสาวของแม่",
    toEn: "To my daughter",
    quote: "ในวันที่ลูกได้เป็นคุณแม่ — แม่ภูมิใจในตัวลูกเสมอ และจะรักลูกตลอดไป",
    quoteEn: "On the day you become a mother — I have always been proud of you.",
  },
  {
    photo: "/hero/2.png",
    to: "ถึงทีมของผม",
    toEn: "To my team",
    quote: "ขอบคุณที่เชื่อมั่นในความฝันเดียวกัน ดูแลกันและกันต่อไปนะ",
    quoteEn: "Thank you for believing in the same dream. Keep looking after each other.",
  },
  {
    photo: "/hero/1.png",
    to: "ถึงเพื่อนรัก",
    toEn: "To my dearest friend",
    quote: "ขอโทษที่ไม่ได้บอกตั้งแต่วันนั้น — ฉันคิดถึงเธอเสมอ",
    quoteEn: "I'm sorry I never said it back then — I always think of you.",
  },
];

// Short heartfelt one-liners for the rotating-quote gimmick.
export const QUOTES: { th: string; en: string }[] = [
  { th: "“ขอบคุณที่เป็นพ่อที่ดีที่สุด”", en: "Thank you for being the best father." },
  { th: "“ไว้เจอกันใหม่นะ คนเก่ง”", en: "Until we meet again, my dear." },
  { th: "“แม่ดีใจที่ได้เป็นแม่ของลูก”", en: "I'm so glad I got to be your mother." },
  { th: "“เก็บรอยยิ้มของเราไว้ตรงนี้”", en: "Our smiles are kept right here." },
];
