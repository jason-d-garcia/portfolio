"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { scoreEntries as entries, staffLines, type ScoreGroup } from "@/content/score";

/*
 * The site's signature: the work drawn as a score. Seven staff lines are disciplines, each chord is a project,
 * an idea or a pursuit, with a note on every line it touches. Hollow notes are ideas with nothing built yet.
 * A playhead walks the score until you take over. With sound on, selecting a chord plays it: each line has a
 * pitch from a pentatonic scale, so any combination is consonant.
 */

const H = 250;
const TOP = 38;
const GAP = 29;
const lineY = (i: number) => TOP + i * GAP;
// C major pentatonic, highest pitch on the top line.
const PITCH = [587.33, 523.25, 440, 392, 329.63, 293.66, 261.63];
const groups = entries.reduce<{ name: ScoreGroup; start: number }[]>(
  (acc, e, i) => (acc.at(-1)?.name === e.group ? acc : [...acc, { name: e.group, start: i }]),
  [],
);

export function Score() {
  const [width, setWidth] = useState(1000);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [sound, setSound] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The playhead advances on its own until the visitor picks a chord. It stays still for reduced motion.
  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % entries.length), 2600);
    return () => window.clearInterval(id);
  }, [auto]);

  const play = useCallback((index: number) => {
    const ctx = audio.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    [...entries[index].lines].reverse().forEach((line, n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = PITCH[line];
      const t = now + n * 0.07;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.5);
    });
  }, []);

  const select = (index: number) => {
    setAuto(false);
    if (index !== active) {
      setActive(index);
      if (sound) play(index);
    }
  };

  const toggleSound = () => {
    if (!sound) {
      audio.current ??= new AudioContext();
      void audio.current.resume();
      play(active);
    }
    setSound(!sound);
  };

  const narrow = width < 560;
  // The discipline names sit in a gutter on the left; the chords share what remains.
  const left = narrow ? 126 : 196;
  const right = narrow ? 4 : 24;
  const step = (width - left - right) / entries.length;
  const colX = (i: number) => left + step * (i + 0.5);
  const current = entries[active];
  const touched = new Set(current.lines);

  return (
    <div className="select-none">
      <div ref={wrap} className="relative">
        <svg viewBox={`0 0 ${width} ${H}`} width="100%" height={H} aria-hidden className="block overflow-visible">
          {groups.map((g, gi) => {
            const x = left + step * g.start;
            return (
              <g key={g.name}>
                {gi > 0 && <line x1={x} y1={lineY(0)} x2={x} y2={lineY(6)} stroke="var(--rule)" strokeWidth="1" />}
                <text x={x + (gi > 0 ? 6 : 0)} y="12" fontSize={narrow ? 8 : 10} letterSpacing="0.08em" fill="var(--muted)" fontFamily="var(--font-mono)">
                  {(narrow ? g.name.split(" ")[0] : g.name).toUpperCase()}
                </text>
              </g>
            );
          })}

          {staffLines.map((name, i) => (
            <g key={name}>
              <line
                x1={left - 12}
                x2={width}
                y1={lineY(i)}
                y2={lineY(i)}
                stroke={touched.has(i) ? "var(--accent)" : "var(--rule)"}
                strokeWidth="1"
                style={{ transition: "stroke 400ms" }}
              />
              <text
                x="0"
                y={lineY(i) + 3}
                fontSize={narrow ? 8 : 10}
                letterSpacing="0.06em"
                fill={touched.has(i) ? "var(--ink)" : "var(--muted)"}
                fontFamily="var(--font-mono)"
                style={{ transition: "fill 400ms" }}
              >
                {name.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Playhead */}
          <line
            x1="0"
            x2="0"
            y1={lineY(0) - 10}
            y2={lineY(6) + 10}
            stroke="var(--accent)"
            strokeWidth="1"
            strokeDasharray="2 3"
            style={{ transform: `translateX(${colX(active)}px)`, transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          />

          {entries.map((e, i) => {
            const on = i === active;
            const x = colX(i);
            const ys = e.lines.map(lineY);
            const color = on ? "var(--accent)" : "var(--ink)";
            const rx = narrow ? 5.5 : 7.5;
            return (
              <g key={e.name} opacity={on ? 1 : 0.8} style={{ transition: "opacity 300ms" }}>
                <line x1={x + rx - 0.5} x2={x + rx - 0.5} y1={Math.min(...ys) - 24} y2={Math.max(...ys)} stroke={color} strokeWidth="1.25" />
                {ys.map((y) => (
                  <ellipse
                    key={y}
                    cx={x}
                    cy={y}
                    rx={rx}
                    ry={rx * 0.7}
                    transform={`rotate(-20 ${x} ${y})`}
                    fill={e.built ? color : "var(--bg)"}
                    stroke={color}
                    strokeWidth="1.5"
                  />
                ))}
                <text x={x} y={H - 6} textAnchor="middle" fontSize="10" fill={on ? "var(--accent-text)" : "var(--muted)"} fontFamily="var(--font-mono)">
                  {String(i + 1).padStart(2, "0")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* One invisible column per chord: hover or tap selects it. Keyboard users get the same from the list below. */}
        <div className="absolute inset-0 flex" style={{ paddingLeft: left, paddingRight: right }}>
          {entries.map((e, i) => (
            <button
              key={e.name}
              type="button"
              tabIndex={-1}
              aria-hidden
              onPointerEnter={(ev) => ev.pointerType === "mouse" && select(i)}
              onClick={() => select(i)}
              className="h-full flex-1 cursor-pointer"
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 border-t border-rule pt-5 sm:grid-cols-12 sm:gap-8">
        <div aria-live="polite" className="min-h-[7.5rem] sm:col-span-7">
          <p className="meta">
            <span className="text-accent-text">{String(active + 1).padStart(2, "0")}</span> · {current.group}
            {!current.built && " · idea, not built"}
          </p>
          <p className="mt-2 font-display text-2xl leading-tight tracking-[-0.01em]">
            <Link href={current.href} className="link">
              {current.name} <span aria-hidden>→</span>
            </Link>
          </p>
          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-snug text-muted">{current.note}</p>
        </div>
        <div className="sm:col-span-5">
          <ol className="flex flex-wrap gap-x-1 gap-y-1" aria-label="Chords in the score">
            {entries.map((e, i) => (
              <li key={e.name}>
                <button
                  type="button"
                  aria-pressed={i === active}
                  aria-label={`${e.name}: ${e.lines.map((l) => staffLines[l]).join(", ")}`}
                  onClick={() => select(i)}
                  onFocus={() => select(i)}
                  className="meta grid size-9 place-items-center border border-rule transition-colors hover:border-ink aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={toggleSound} aria-pressed={sound} className="meta mt-3 inline-flex items-center gap-2 py-1 hover:text-ink">
            <span aria-hidden className={`inline-block size-2 rounded-full ${sound ? "bg-accent" : "ring-1 ring-muted"}`} />
            Sound {sound ? "on" : "off"}
          </button>
        </div>
      </div>
    </div>
  );
}
