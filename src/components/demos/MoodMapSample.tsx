"use client";

import { useId, useMemo, useRef, useState } from "react";
import sample from "@/content/demos/senti-sample.json";

/*
 * A small, static slice of senti's mood map. Positions are copied from the live catalogue in the senti repo,
 * so this runs entirely in the browser: no model, no API. The full map lives at playsenti.com.
 */

type Row = [title: string, artist: string, year: number, valence: number, arousal: number];
const songs = sample.songs as Row[];

// senti's 16 emotions, counter-clockwise from "feels good", 22.5 degrees each (src/mood.ts in the senti repo).
const EMOTIONS = [
  "Happy", "Elated", "Excited", "Alert", "Tense", "Nervous", "Stressed", "Upset",
  "Sad", "Depressed", "Lethargic", "Fatigued", "Calm", "Relaxed", "Serene", "Contented",
];
const MIXED_RADIUS = 0.2;

function emotionAt(v: number, a: number) {
  if (Math.hypot(v, a) < MIXED_RADIUS) return "Mixed";
  const deg = ((Math.atan2(a, v) * 180) / Math.PI + 360) % 360;
  return EMOTIONS[Math.min(15, Math.floor(deg / 22.5))];
}

const SIZE = 200;
// The catalogue's predictions sit well inside [-1, 1] (they are pulled toward the centre), so the plot shows +/-0.8.
const R = 0.8;
const toX = (v: number) => ((v / R + 1) / 2) * SIZE;
const toY = (a: number) => ((1 - a / R) / 2) * SIZE;
const clamp = (n: number) => Math.max(-R, Math.min(R, Math.round(n * 100) / 100));

// Sector boundary rays, drawn from the centre to the edge of the square.
const rays = Array.from({ length: 16 }, (_, i) => {
  const t = (i * 22.5 * Math.PI) / 180;
  const k = 1 / Math.max(Math.abs(Math.cos(t)), Math.abs(Math.sin(t)));
  return { x: toX(Math.cos(t) * k * R), y: toY(Math.sin(t) * k * R) };
});

export function MoodMapSample() {
  const [point, setPoint] = useState({ v: 0.35, a: 0.2 });
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const ids = useId();

  const nearest = useMemo(
    () =>
      songs
        .map((s) => ({ s, d: Math.hypot(s[3] - point.v, s[4] - point.a) }))
        .sort((x, y) => x.d - y.d)
        .slice(0, 5)
        .map((x) => x.s),
    [point],
  );
  const nearSet = new Set(nearest);
  const emotion = emotionAt(point.v, point.a);

  const moveTo = (clientX: number, clientY: number) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    setPoint({
      v: clamp((((clientX - box.left) / box.width) * 2 - 1) * R),
      a: clamp((1 - ((clientY - box.top) / box.height) * 2) * R),
    });
  };

  return (
    <div className="font-sans">
      <svg
        ref={svg}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-md cursor-crosshair touch-none select-none"
        role="img"
        aria-labelledby={`${ids}-cap`}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          moveTo(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => dragging.current && moveTo(e.clientX, e.clientY)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <rect x="0.5" y="0.5" width={SIZE - 1} height={SIZE - 1} fill="var(--surface)" />
        {rays.map((r, i) => (
          <line key={i} x1={SIZE / 2} y1={SIZE / 2} x2={r.x} y2={r.y} stroke="var(--bg)" strokeWidth="0.8" />
        ))}
        <line x1={SIZE / 2} y1="0" x2={SIZE / 2} y2={SIZE} stroke="var(--muted)" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} stroke="var(--muted)" strokeWidth="0.5" opacity="0.6" />
        <circle cx={SIZE / 2} cy={SIZE / 2} r={(MIXED_RADIUS / R) * (SIZE / 2)} fill="var(--bg)" opacity="0.7" />
        <circle cx={toX(point.v)} cy={toY(point.a)} r="9" fill="none" stroke="var(--ink)" strokeWidth="0.8" strokeDasharray="2 1.5" />
        <circle cx={toX(point.v)} cy={toY(point.a)} r="2.2" fill="var(--ink)" />
        {[...songs].sort((x, y) => Number(nearSet.has(x)) - Number(nearSet.has(y))).map((s) => (
          <circle
            key={`${s[0]}-${s[1]}`}
            cx={toX(s[3])}
            cy={toY(s[4])}
            r={nearSet.has(s) ? 2.6 : 1.6}
            fill={nearSet.has(s) ? "var(--accent)" : "var(--muted)"}
            stroke="var(--surface)"
            strokeWidth="0.6"
            opacity={nearSet.has(s) ? 1 : 0.65}
          />
        ))}
        <text x={SIZE - 4} y={SIZE / 2 - 3} textAnchor="end" fontSize="6" fill="var(--muted)" fontFamily="var(--font-mono)">FEELS GOOD →</text>
        <text x="4" y={SIZE / 2 - 3} fontSize="6" fill="var(--muted)" fontFamily="var(--font-mono)">← FEELS BAD</text>
        <text x={SIZE / 2 + 3} y="9" fontSize="6" fill="var(--muted)" fontFamily="var(--font-mono)">WIRED ↑</text>
        <text x={SIZE / 2 + 3} y={SIZE - 4} fontSize="6" fill="var(--muted)" fontFamily="var(--font-mono)">CALM ↓</text>
      </svg>
      <p id={`${ids}-cap`} className="sr-only">
        Mood map with {songs.length} songs plotted by valence and arousal. Use the two sliders below to move the point.
      </p>

      <div className="mt-4 grid max-w-md gap-3 sm:grid-cols-2">
        {([
          ["v", "Valence", "feels bad to feels good"],
          ["a", "Arousal", "calm to wired"],
        ] as const).map(([key, label, hint]) => (
          <label key={key} className="block text-sm">
            <span className="flex justify-between">
              <span>{label}</span>
              <span className="tabular-nums text-muted">{point[key].toFixed(2)}</span>
            </span>
            <input
              type="range"
              min={-R}
              max={R}
              step={0.05}
              value={point[key]}
              aria-describedby={`${ids}-${key}`}
              onChange={(e) => setPoint((p) => ({ ...p, [key]: Number(e.target.value) }))}
              className="mt-1 h-6 w-full accent-[var(--accent)]"
            />
            <span id={`${ids}-${key}`} className="text-xs text-muted">{hint}</span>
          </label>
        ))}
      </div>

      <div className="mt-5 max-w-md" aria-live="polite">
        <p className="text-sm text-muted">
          This spot reads as <strong className="font-medium text-ink">{emotion}</strong>. Closest songs in the sample:
        </p>
        <ol className="mt-2 space-y-1 text-sm">
          {nearest.map((s) => (
            <li key={`${s[0]}-${s[1]}`} className="flex gap-2">
              <span className="min-w-0 flex-1 truncate">
                <span className="text-ink">{s[0]}</span> <span className="text-muted">· {s[1]}</span>
              </span>
              <span className="shrink-0 tabular-nums text-muted">{s[2]}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-5 max-w-md text-xs leading-snug text-muted">
        {songs.length} of the {sample.catalogSize.toLocaleString("en-US")} songs on the live map: the seven highest-charting songs (one per
        artist) from each of its 16 emotions plus Mixed, at the positions the live map uses. Everything here runs in your browser.{" "}
        <a href="https://playsenti.com" className="text-accent-text underline underline-offset-2">
          Open the full map at playsenti.com ↗
        </a>
      </p>
    </div>
  );
}
