import type { ReactNode } from "react";
import { Card } from "./ui";

// Honest placeholder for screens scheduled in a later build slice. Keeps the
// shell navigable without pretending unfinished work is done.

export function SlicePlaceholder({
  title,
  slice,
  children,
}: {
  title: string;
  slice: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl text-ink">{title}</h1>
      <Card className="mt-5 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
          {slice}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          ส่วนนี้จะถูกพัฒนาในขั้นถัดไป — โครงและการนำทางพร้อมแล้ว
        </p>
        {children && <div className="mt-4 text-sm text-muted">{children}</div>}
      </Card>
    </div>
  );
}
