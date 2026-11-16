"use client";

import { useId, useState } from "react";
import { hookClusters, topicLifts } from "@/content/demos/results";

const MIN = 0.6;
const MAX = 1.9;
const pos = (x: number) => `${((x - MIN) / (MAX - MIN)) * 100}%`;
const ticks = [0.75, 1, 1.25, 1.5, 1.75];

type Sort = "lift" | "clips";

export function HookLiftChart() {
  const [sort, setSort] = useState<Sort>("lift");
  const [selected, setSelected] = useState(hookClusters.clusters[0].id);
  const ids = useId();
  const rows = [...hookClusters.clusters].sort((a, b) => (sort === "lift" ? b.lift - a.lift : b.clips - a.clips));
  const sel = hookClusters.clusters.find((c) => c.id === selected)!;

  return (
    <figure className="m-0 font-sans">
      <figcaption id={`${ids}-title`} className="text-base text-ink">
        Views by opening type, relative to the same creator&apos;s other posts
      </figcaption>
      <p className="mt-1 text-sm text-muted">
        Dot: median lift. Line: 95% interval. Left of the 1x line means the opening type does worse than the creator&apos;s
        usual; right means better. Select a row for details.
      </p>

      <div role="group" aria-label="Sort clusters" className="mt-4 flex flex-wrap gap-2 text-sm">
        {(["lift", "clips"] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={sort === s}
            onClick={() => setSort(s)}
            className="h-9 px-3 ring-1 ring-surface aria-pressed:bg-ink aria-pressed:text-bg"
          >
            {s === "lift" ? "Sort by lift" : "Sort by number of clips"}
          </button>
        ))}
      </div>

      <div className="relative mt-4">
        {/* Axis ticks share the track column so they line up with the marks. */}
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-[13rem_1fr]" aria-hidden>
          <span className="max-sm:hidden" />
          <div className="relative h-5 text-xs text-muted tabular-nums">
            {ticks.map((t) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: pos(t) }}>{t}x</span>
            ))}
          </div>
        </div>
        <ul aria-labelledby={`${ids}-title`} className="space-y-1">
          {rows.map((c) => {
            const active = c.id === selected;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  aria-label={`${c.name}: ${c.lift}x the creator's norm, 95% interval ${c.lo} to ${c.hi}, ${c.clips.toLocaleString("en-US")} clips`}
                  onClick={() => setSelected(c.id)}
                  className={`grid w-full grid-cols-1 items-center gap-x-4 px-1 py-1.5 text-left text-sm sm:grid-cols-[13rem_1fr] ${active ? "bg-surface" : "hover:bg-surface/60"}`}
                >
                  <span className="flex justify-between gap-2">
                    <span className="truncate">{c.name}</span>
                    <span className="tabular-nums text-muted sm:hidden">{c.lift.toFixed(2)}x</span>
                  </span>
                  <span className="relative block h-5">
                    <span className="absolute inset-y-0 w-px bg-muted/60" style={{ left: pos(1) }} />
                    {ticks.filter((t) => t !== 1).map((t) => (
                      <span key={t} className="absolute inset-y-0 w-px bg-surface" style={{ left: pos(t) }} />
                    ))}
                    <span
                      className={`absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full ${c.lift >= 1 ? "bg-accent" : "bg-muted"}`}
                      style={{ left: pos(c.lo), width: `calc(${pos(c.hi)} - ${pos(c.lo)})` }}
                    />
                    <span
                      className={`absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-bg ${c.lift >= 1 ? "bg-accent" : "bg-muted"}`}
                      style={{ left: pos(c.lift) }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div aria-live="polite" className="mt-5 bg-surface p-4 text-sm">
        <p className="text-base text-ink">
          {sel.name}: <span className="tabular-nums">{sel.lift.toFixed(2)}x</span>{" "}
          <span className="text-muted tabular-nums">[{sel.lo.toFixed(2)}, {sel.hi.toFixed(2)}]</span>
        </p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted">
          <dt>Nearest CLIP labels</dt>
          <dd className="text-ink">{sel.labels}</dd>
          <dt>Clips · creators</dt>
          <dd className="text-ink tabular-nums">{sel.clips.toLocaleString("en-US")} · {sel.creators}</dd>
          <dt>Earlier · later posts</dt>
          <dd className="text-ink tabular-nums">{sel.early.toFixed(2)}x · {sel.late.toFixed(2)}x</dd>
        </dl>
      </div>

      <p className="mt-4 text-sm text-muted">
        The lifts replicate between earlier and later posts (r = +{hookClusters.replication} across the 12 types). The CLIP label
        names are rough: three regions share beauty labels with opposite results. Caption topics showed the same kind of
        effect in my earlier class-project report:{" "}
        {topicLifts.map((t, i) => (
          <span key={t.topic}>
            {t.topic} {t.lift}{i < topicLifts.length - 1 ? ", " : ""}
          </span>
        ))}{" "}
        of a creator&apos;s norm.
      </p>
      <p className="mt-2 text-xs text-muted">Source: {hookClusters.source}</p>
    </figure>
  );
}
