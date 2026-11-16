"use client";

import { useState } from "react";
import { ballroomBaselines } from "@/content/demos/results";

type Metric = "acc" | "f1";
const label: Record<Metric, string> = { acc: "Accuracy", f1: "Macro-F1" };
const fmt = (m: Metric, v: number) => (m === "acc" ? `${v.toFixed(1)}%` : v.toFixed(3).replace(/0$/, ""));
const share = (m: Metric, v: number) => (m === "acc" ? v / 100 : v);

export function BallroomBaselines() {
  const [metric, setMetric] = useState<Metric>("acc");
  const rows = ballroomBaselines;

  return (
    <figure className="m-0 font-sans">
      <figcaption className="text-base text-ink">Six models, 10 dance styles, the same 618 held-out clips</figcaption>

      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <div role="group" aria-label="Metric" className="flex gap-2">
          {(["acc", "f1"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={metric === m}
              onClick={() => setMetric(m)}
              className="h-9 px-3 ring-1 ring-surface aria-pressed:bg-ink aria-pressed:text-bg"
            >
              {label[m]}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {rows.map((r) => {
          const v = metric === "acc" ? r.acc : r.f1;
          return (
            <li key={r.model}>
              <div className="flex justify-between gap-3 text-sm">
                <span className={r.main ? "text-ink" : ""}>{r.model}</span>
                <span className="shrink-0 tabular-nums text-ink">{fmt(metric, v)}</span>
              </div>
              <div className="relative mt-1 h-3 bg-surface" aria-hidden>
                <div
                  className={`absolute inset-y-0 left-0 rounded-r transition-[width] duration-300 motion-reduce:transition-none ${r.main ? "bg-accent" : "bg-muted"}`}
                  style={{ width: `${share(metric, v) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted">{r.note}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-muted">
        Extended Ballroom, 4,180 clips, duplicate-aware 70/15/15 split. A published result on this dataset is 93.9% (Pavlin
        et al. 2020), on a different split, so it is not drawn here.
      </p>
    </figure>
  );
}
