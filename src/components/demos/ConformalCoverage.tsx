"use client";

import { useId, useState } from "react";
import { conformal } from "@/content/demos/results";

const MIN = 0.7;
const MAX = 1;
const pos = (x: number) => `${((x - MIN) / (MAX - MIN)) * 100}%`;
const pct = (x: number) => `${Math.round(x * 100)}%`;

export function ConformalCoverage() {
  const [q, setQ] = useState(0);
  const ids = useId();
  const bars = [
    { name: "Plain split conformal", value: conformal.split[q], width: conformal.width.split, color: "bg-muted" },
    { name: "Mondrian (calibrated per creator size)", value: conformal.mondrian[q], width: conformal.width.mondrian, color: "bg-accent" },
  ];
  const gap = conformal.split[q] < conformal.target - 0.02;

  return (
    <figure className="m-0 font-sans">
      <figcaption className="text-base text-ink">How often the 90% interval actually contains the true views</figcaption>

      <label className="mt-4 block text-sm">
        <span className="flex justify-between">
          <span>Creator size</span>
          <span className="text-ink">{conformal.quartiles[q]}</span>
        </span>
        <input
          type="range"
          min={0}
          max={3}
          step={1}
          value={q}
          aria-valuetext={conformal.quartiles[q]}
          aria-describedby={`${ids}-hint`}
          onChange={(e) => setQ(Number(e.target.value))}
          className="mt-1 h-6 w-full accent-[var(--accent)]"
        />
        <span id={`${ids}-hint`} className="flex justify-between text-xs text-muted" aria-hidden>
          <span>smallest</span>
          <span>largest</span>
        </span>
      </label>

      <div className="relative mt-6">
        <div className="space-y-4" aria-live="polite">
          {bars.map((b) => (
            <div key={b.name}>
              <div className="flex justify-between gap-3 text-sm">
                <span>{b.name}</span>
                <span className="tabular-nums text-ink">{pct(b.value)}</span>
              </div>
              <div className="relative mt-1 h-3 bg-surface">
                <div className={`absolute inset-y-0 left-0 rounded-r ${b.color}`} style={{ width: pos(b.value) }} />
                <div className="absolute -inset-y-1 w-0.5 bg-ink" style={{ left: pos(conformal.target) }} aria-hidden />
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-1 h-4 text-xs text-muted tabular-nums" aria-hidden>
          <span className="absolute left-0">70%</span>
          <span className="absolute -translate-x-1/2 text-ink" style={{ left: pos(conformal.target) }}>90% target</span>
          <span className="absolute right-0">100%</span>
        </div>
      </div>

      <p className="mt-5 text-sm">
        {gap
          ? "Plain conformal hits 90% on average, but for the smallest creators it misses one time in five. Calibrating each size group on its own brings them back to target."
          : "For this group both methods meet the target. Plain conformal makes up for the smallest creators by over-covering the bigger ones."}
      </p>

      <table className="mt-5 w-full text-left text-sm tabular-nums">
        <caption className="sr-only">Coverage by creator-size quartile</caption>
        <thead className="text-muted">
          <tr className="border-b border-surface">
            <th scope="col" className="py-1 pr-2 font-normal">Creator size</th>
            <th scope="col" className="py-1 pr-2 font-normal">Plain</th>
            <th scope="col" className="py-1 font-normal">Mondrian</th>
          </tr>
        </thead>
        <tbody>
          {conformal.quartiles.map((name, i) => (
            <tr key={name} className={`border-b border-surface ${i === q ? "text-ink" : "text-muted"}`}>
              <th scope="row" className="py-1 pr-2 font-normal">{name}</th>
              <td className="py-1 pr-2">{pct(conformal.split[i])}</td>
              <td className="py-1">{pct(conformal.mondrian[i])}</td>
            </tr>
          ))}
          <tr>
            <th scope="row" className="py-1 pr-2 font-normal text-muted">All posts · interval width</th>
            <td className="py-1 pr-2 text-muted">{pct(conformal.overall.split)} · {conformal.width.split}</td>
            <td className="py-1 text-muted">{pct(conformal.overall.mondrian)} · {conformal.width.mondrian}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted">
        SMP-Video, 4,000 posts from 3,488 creators, 5-fold creator-disjoint cross-validation, content and caption features only.
        Width is in log2 views per day: 8.6 against 8.7 means fixing small-creator coverage cost no extra width.
      </p>
    </figure>
  );
}
