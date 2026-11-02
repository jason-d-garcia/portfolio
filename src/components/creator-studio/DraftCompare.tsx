"use client";

import { useMemo, useState } from "react";
import { COVERAGE, assignTiers, feedback, fmtViews, predict, type Draft } from "@/lib/creator-studio/model";

const LETTERS = "ABCDEF";
const MAX = 6;
const MIN = 2;

const EXAMPLES: Omit<Draft, "id">[] = [
  { hook: "Wait for the last spin", caption: "Three weeks of practice in 20 seconds #ballroom #dance #waltz #practice", lengthS: 20, hour: 19 },
  { hook: "Here is a video of our practice session from last Tuesday night at the studio", caption: "practice", lengthS: 75, hour: 3 },
];

const input = "w-full rounded border border-muted/40 bg-bg px-2 py-1.5 font-sans text-sm";
const label = "grid gap-1 font-sans text-xs text-muted";

export function DraftCompare() {
  const [typical, setTypical] = useState(5000);
  const [nextId, setNextId] = useState(EXAMPLES.length);
  const [drafts, setDrafts] = useState<Draft[]>(EXAMPLES.map((d, id) => ({ ...d, id })));

  const ranked = useMemo(() => assignTiers(drafts.map((d) => predict(d, typical))), [drafts, typical]);
  const letter = (id: number) => LETTERS[drafts.findIndex((d) => d.id === id)];
  const byId = (id: number) => drafts.find((d) => d.id === id)!;
  const update = (id: number, patch: Partial<Draft>) => setDrafts((ds) => ds.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  const add = () => {
    setDrafts((ds) => [...ds, { id: nextId, hook: "", caption: "", lengthS: 20, hour: 19 }]);
    setNextId((n) => n + 1);
  };
  const remove = (id: number) => setDrafts((ds) => ds.filter((d) => d.id !== id));
  const topTier = ranked.filter((r) => r.tier === 1);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="grid content-start gap-4">
        <div className="rounded-md bg-surface p-4">
          <label className={label}>
            Your typical views per post (the median of your last 10 is a good number)
            <input
              type="number"
              min={1}
              className={input}
              value={typical}
              onChange={(e) => setTypical(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
        </div>
        {drafts.map((d, i) => (
          <div key={d.id} className="rounded-md bg-surface p-4">
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <h2 className="text-xl font-medium">Version {LETTERS[i]}</h2>
              {drafts.length > MIN && (
                <button onClick={() => remove(d.id)} className="font-sans text-xs text-muted underline-offset-4 hover:text-ink hover:underline">
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-3">
              <label className={label}>
                Hook (what viewers see or hear in the first seconds)
                <input className={input} value={d.hook} onChange={(e) => update(d.id, { hook: e.target.value })} />
              </label>
              <label className={label}>
                Caption with hashtags
                <textarea rows={2} className={input} value={d.caption} onChange={(e) => update(d.id, { caption: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={label}>
                  Length (seconds)
                  <input type="number" min={1} className={input} value={d.lengthS} onChange={(e) => update(d.id, { lengthS: Number(e.target.value) || 0 })} />
                </label>
                <label className={label}>
                  Posting hour
                  <select className={input} value={d.hour} onChange={(e) => update(d.id, { hour: Number(e.target.value) })}>
                    {Array.from({ length: 24 }, (_, h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        ))}
        {drafts.length < MAX && (
          <button onClick={add} className="h-11 justify-self-start bg-accent px-5 text-accent-ink transition-transform hover:-translate-y-0.5">
            Add a version
          </button>
        )}
      </section>

      <section className="grid content-start gap-4" aria-live="polite">
        <div className="rounded-md bg-surface p-4">
          <h2 className="mb-1 text-xl font-medium">Ranking</h2>
          <p className="font-sans text-sm">
            {topTier.length === 1
              ? `Version ${letter(topTier[0].id)} is ahead by more than the model can resolve.`
              : `Versions ${topTier.map((r) => letter(r.id)).join(", ")} are tied: they are within about 1.4x of each other, which is closer than the model can tell apart.`}
          </p>
        </div>
        {ranked.map((r) => {
          const fb = feedback(byId(r.id));
          const mult = 10 ** (r.median - r.baseline);
          return (
            <div key={r.id} className="rounded-md bg-surface p-4">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium">Version {letter(r.id)}</h3>
                <span className="font-sans text-xs text-muted">
                  Tier {r.tier}
                  {r.tier === 1 ? " (top)" : ""}
                </span>
              </div>
              <p className="text-2xl">
                {fmtViews(10 ** r.median)} <span className="font-sans text-sm text-muted">views expected</span>
              </p>
              <p className="font-sans text-sm text-muted">
                {Math.round(COVERAGE * 100)}% range {fmtViews(10 ** r.lower)} to {fmtViews(10 ** r.upper)} · {mult.toFixed(2)}x your typical post
              </p>
              {r.drivers.length > 0 && (
                <ul className="mt-3 grid gap-0.5 font-sans text-sm">
                  {r.drivers.map((dv) => (
                    <li key={dv.label} className="flex justify-between gap-2">
                      <span>{dv.label}</span>
                      <span className={dv.delta > 0 ? "text-accent-text" : "text-field-1"}>
                        {dv.delta > 0 ? "+" : "−"}
                        {Math.round((10 ** Math.abs(dv.delta) - 1) * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {(fb.notes.length > 0 || fb.edits.length > 0) && (
                <div className="mt-3 font-sans text-sm">
                  {fb.notes.map((n) => (
                    <p key={n}>{n}</p>
                  ))}
                  {fb.edits.length > 0 && (
                    <ul className="mt-1 list-disc pl-5 text-muted">
                      {fb.edits.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
