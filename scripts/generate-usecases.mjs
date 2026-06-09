// Generate 7 warm portraits — one face per use-case story on the /stories page.
// Saves public/usecases/1.png .. 7.png. gpt-image-1, warm sunlit style.
//
// Usage: source a real key, then `node scripts/generate-usecases.mjs [n...]`

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const KEY = (process.env.OPENAI_API_KEY || "").trim();
if (!KEY || KEY.startsWith("sk-paste") || KEY.length < 40) {
  console.error("No valid OPENAI_API_KEY in env.");
  process.exit(1);
}

const OUT = path.join(process.cwd(), "public", "usecases");

const STYLE =
  "Warm, sunlit editorial lifestyle portrait, soft golden natural light, clean " +
  "warm backdrop with gentle color. Premium, tasteful, heartfelt and human. A " +
  "genuine warm expression. Subtle film grain. Head-and-shoulders, face roughly " +
  "centered. No text, no logo, no watermark.";

// International mix — a Thai core plus several ethnicities for a global feel.
const PEOPLE = [
  "a warm Thai woman around 54 with a gentle genuine smile, elegant simple styling",
  "a kind Thai man around 61 with a soft reassuring expression, in a simple shirt",
  "a thoughtful European man around 42 with a gentle warm look, smart-casual",
  "a confident South Asian (Indian) woman around 46, a poised warm smile, in a refined blazer",
  "a serene elderly Thai woman around 78 with kind eyes and a soft smile",
  "a steady, dependable Black man around 50 with a calm warm expression",
  "a hopeful young Latina woman around 33 with a soft tender smile, looking toward soft light",
];

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
    }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return Buffer.from(data.data[0].b64_json, "base64");
}

await mkdir(OUT, { recursive: true });
const pick = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= 7);
const idxs = pick.length ? pick.map((n) => n - 1) : PEOPLE.map((_, i) => i);
for (const i of idxs) {
  console.log(`Generating use-case portrait ${i + 1}/7…`);
  const buf = await gen(`${STYLE} Subject: ${PEOPLE[i]}.`);
  await writeFile(path.join(OUT, `${i + 1}.png`), buf);
  console.log(`  saved public/usecases/${i + 1}.png (${Math.round(buf.length / 1024)} KB)`);
}
console.log("Done.");
