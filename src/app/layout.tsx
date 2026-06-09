import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Thai,
  Noto_Serif_Thai,
  Cormorant,
  Fraunces,
} from "next/font/google";
import "./globals.css";

// Display faces for large hero / threshold moments (Latin only; Thai uses Noto
// Serif Thai). Both loaded so the display face can be A/B'd via --font-display.
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

// Fraunces — soft "old-style" serif with optical sizing: warm, literary, with
// gravity. Current display face (see --font-display in globals.css).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Body — clean readable Thai sans with a real Thai cut (DESIGN.md §2).
const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// Headings — humanist serif with gravity + warmth, proper Thai support.
const serifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Will — พื้นที่เก็บความทรงจำและสิ่งสำคัญ",
  description:
    "พื้นที่เก็บความทรงจำ คำพูดสุดท้าย และสิ่งสำคัญ ไว้ให้คนที่คุณรัก (PROTOTYPE — synthetic data only)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${plexThai.variable} ${serifThai.variable} ${cormorant.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
