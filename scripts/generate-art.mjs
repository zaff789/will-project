// Generate a cohesive set of warm spot illustrations (ภาพประกอบ / element ย่อย)
// to elevate the UI. Transparent PNGs in public/art/. gpt-image-1, transparent bg.
//
// Usage: source a real key, then `node scripts/generate-art.mjs [names...]`

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const KEY = (process.env.OPENAI_API_KEY || "").trim();
if (!KEY || KEY.startsWith("sk-paste") || KEY.length < 40) {
  console.error("No valid OPENAI_API_KEY in env.");
  process.exit(1);
}

const OUT = path.join(process.cwd(), "public", "art");

const STYLE =
  "Minimal elegant editorial spot illustration, warm muted palette of terracotta, " +
  "amber gold and soft sienna only. Delicate fine-line drawing with a soft gentle " +
  "watercolor wash, premium, tasteful, hopeful and warm. A single centered subject " +
  "with generous empty padding all around. Fully transparent background. No text, " +
  "no frame, no border, no shadow on the ground.";

const ART = {
  letter:
    STYLE +
    " Subject: a softly folded letter / envelope with a small warm light glowing " +
    "gently from within.",
  light:
    STYLE +
    " Subject: a single small warm candle flame, a soft serene orb of warm light.",
  hands:
    STYLE +
    " Subject: two gentle cupped hands holding a small warm glow of light together, " +
    "tender and caring.",
  bloom:
    STYLE +
    " Subject: a small delicate blooming flower opening toward warm light, a quiet " +
    "symbol of remembrance and life.",
};

const names = process.argv.slice(2).filter((n) => ART[n]);
const todo = names.length ? names : Object.keys(ART);

async function gen(prompt) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "high",
      background: "transparent",
    }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return Buffer.from(data.data[0].b64_json, "base64");
}

await mkdir(OUT, { recursive: true });
for (const name of todo) {
  console.log(`Generating ${name}…`);
  const buf = await gen(ART[name]);
  await writeFile(path.join(OUT, `${name}.png`), buf);
  console.log(`  saved public/art/${name}.png (${Math.round(buf.length / 1024)} KB)`);
}
console.log("Done.");
