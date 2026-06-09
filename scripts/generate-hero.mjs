// Generate the 3 warm rim-lit silhouette hero images for the landing carousel.
//
// Usage (key is read from env; source it from ~/openai-studio/.env first):
//   node scripts/generate-hero.mjs
//
// Saves public/hero/1.png .. 3.png. Tries gpt-image-1, falls back to dall-e-3.
// Reference mood: Voronoi "CURRENT" — warm brown, dignified human silhouette.

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const KEY = (process.env.OPENAI_API_KEY || "").trim();
if (!KEY || KEY.startsWith("sk-paste") || KEY.length < 40) {
  console.error(
    "No valid OPENAI_API_KEY in env. Put a real key in ~/openai-studio/.env, then run:\n" +
      "  export OPENAI_API_KEY=$(grep '^OPENAI_API_KEY=' ~/openai-studio/.env | cut -d= -f2-)\n" +
      "  node scripts/generate-hero.mjs",
  );
  process.exit(1);
}

const OUT = path.join(process.cwd(), "public", "hero");

const BASE =
  "Bright, warm and joyful high-end editorial lifestyle portrait, cinematic and " +
  "heartfelt. Sunlit, uplifting, colorful palette — soft golden daylight with " +
  "gentle warm color and a tasteful pop of color in the styling. An elegant, " +
  "sophisticated adult wearing a beautiful, refined, stylish outfit, with a " +
  "genuine warm happy smile — radiant, full of life and love. Soft natural " +
  "sunlight, airy and premium, a clean warm sunlit backdrop with gentle color. " +
  "Subtle film grain. Generous bright negative space on the LEFT of the frame " +
  "for text. No text, no logo, no watermark. Hopeful, heartfelt, celebrating " +
  "life and love — happy, never sad.";

const PROMPTS = [
  BASE +
    " Subject: a radiant East Asian woman with elegant stylish fashion, laughing " +
    "softly with a genuine joyful smile, looking slightly off-camera, placed on " +
    "the right third of the frame.",
  BASE +
    " Subject: a distinguished European man in a beautifully tailored stylish " +
    "outfit, a warm genuine happy smile, relaxed and confident, placed on the " +
    "right third of the frame.",
  BASE +
    " Subject: an elegant Thai woman in refined, colorful modern fashion, a bright " +
    "radiant joyful smile full of warmth, placed on the right third of the frame.",
];

// Optionally generate only specific images: `node scripts/generate-hero.mjs 3`
// (1-based). With no arg, generates all three.
const ONLY = process.argv.slice(2).map((n) => Number(n) - 1).filter((n) => n >= 0);

async function openaiImage(prompt) {
  // Try gpt-image-1 (best photographic adherence) first.
  for (const cfg of [
    { model: "gpt-image-1", size: "1536x1024", quality: "high" },
    { model: "dall-e-3", size: "1792x1024", response_format: "b64_json" },
  ]) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({ prompt, n: 1, ...cfg }),
    });
    if (res.ok) {
      const data = await res.json();
      const b64 = data.data?.[0]?.b64_json;
      if (b64) return Buffer.from(b64, "base64");
    } else {
      const t = await res.text();
      console.warn(`${cfg.model} failed (${res.status}): ${t.slice(0, 180)}`);
    }
  }
  throw new Error("Both image models failed.");
}

await mkdir(OUT, { recursive: true });
const indices = ONLY.length ? ONLY : PROMPTS.map((_, i) => i);
for (const i of indices) {
  console.log(`Generating image ${i + 1}/${PROMPTS.length}…`);
  const buf = await openaiImage(PROMPTS[i]);
  const file = path.join(OUT, `${i + 1}.png`);
  await writeFile(file, buf);
  console.log(`  saved ${file} (${Math.round(buf.length / 1024)} KB)`);
}
console.log("Done. Reload the landing — the carousel will pick them up.");
