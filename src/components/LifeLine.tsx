"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BIRTH_YEAR, milestones, type Prop } from "@/content/life";

/*
 * A walkable biography. The figure stays in the middle and the timeline moves under it; hold the arrow keys,
 * drag, or swipe to walk, and the figure grows from a crawling baby to an adult along the way.
 * Position `p` runs from 0 to milestones.length - 1, so whole numbers are milestones.
 * Under reduced motion nothing glides or swings: each key press or button steps straight to the next milestone.
 */

const LAST = milestones.length - 1;
const SPEED = 1.6; // milestones per second while a key is held
const H = 230;
const GROUND = 178;
const clamp = (n: number) => Math.max(0, Math.min(LAST, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Height of the figure in px for an age, between hand-set anchors.
const HEIGHTS: [number, number][] = [[0, 30], [2, 40], [4, 50], [10, 70], [16, 90], [20, 96], [30, 96]];
function heightAt(age: number) {
  for (let i = 1; i < HEIGHTS.length; i++) {
    const [a1, h1] = HEIGHTS[i];
    const [a0, h0] = HEIGHTS[i - 1];
    if (age <= a1) return lerp(h0, h1, (age - a0) / (a1 - a0));
  }
  return 96;
}

function ageAt(p: number) {
  const i = Math.min(LAST - 1, Math.floor(p));
  return lerp(milestones[i].year, milestones[i + 1].year, p - i) - BIRTH_YEAR;
}

/* One small line drawing per kind of milestone, in a 24 x 24 box whose bottom edge is the ground. */
function PropGlyph({ kind }: { kind: Prop }) {
  switch (kind) {
    case "cradle":
      return <><path d="M3 12h18l-2 8H5z" /><path d="M2 24c3-3 17-3 20 0" /><path d="M3 12c0-5 4-7 8-7" /></>;
    case "ball":
      return <><circle cx="12" cy="15" r="8.5" /><path d="M12 10.5l4.3 3.1-1.6 5h-5.4l-1.6-5z" /></>;
    case "controller":
      return <><rect x="2" y="11" width="20" height="11" rx="4" /><path d="M7 14.5v4M5 16.5h4" /><circle cx="16" cy="15.5" r="0.9" /><circle cx="18.5" cy="18" r="0.9" /></>;
    case "keys":
      return <><rect x="2" y="9" width="20" height="14" /><path d="M7 9v14M12 9v14M17 9v14" /><path d="M5.5 9v8h3V9M10.5 9v8h3V9M15.5 9v8h3V9" /></>;
    case "book":
      return <><path d="M12 9c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V8c-3-1-6-1-9 1z" /><path d="M12 9v14" /></>;
    case "cube":
      return <><rect x="4" y="7" width="16" height="16" /><path d="M9.3 7v16M14.7 7v16M4 12.3h16M4 17.7h16" /></>;
    case "note":
      return <><ellipse cx="7" cy="20" rx="3.5" ry="2.6" /><ellipse cx="18" cy="17" rx="3.5" ry="2.6" /><path d="M10.5 20V6l11-3v14" /><path d="M10.5 10l11-3" /></>;
    case "cards":
      return <><rect x="4" y="8" width="11" height="15" rx="1.5" transform="rotate(-10 9.5 15.5)" /><rect x="10" y="7" width="11" height="15" rx="1.5" transform="rotate(10 15.5 14.5)" /></>;
    case "badge":
      return <><path d="M12 4l7 3v7c0 5-3.5 8-7 9.5C8.500 22 5 19 5 14V7z" /><path d="M9 13.500l2.200 2.200 4-4.500" /></>;
    case "stage":
      return <><path d="M2 5h20v18" /><path d="M2 5v18" /><path d="M2 5c2 6 2 10 5 13M22 5c-2 6-2 10-5 13" /><path d="M1 23h22" /></>;
    case "cap":
      return <><path d="M1 12l11-5 11 5-11 5z" /><path d="M6 14.500v5c3 2.500 9 2.500 12 0v-5" /><path d="M23 12v7" /></>;
    case "globe":
      return <><circle cx="12" cy="14" r="9" /><path d="M3 14h18M12 5c-4 3-4 15 0 18M12 5c4 3 4 15 0 18" /></>;
    case "chalk":
      return <><rect x="2" y="6" width="20" height="13" /><path d="M6 11h7M6 14.500h11" /><path d="M8 19l-2 5M16 19l2 5" /></>;
    case "shoe":
      return <><path d="M2 15v6h20c0-3-3-4-7-5l-4-4c-1 2-4 3-9 3z" /><path d="M2 18.500h20" /></>;
    case "house":
      return <><path d="M3 23V12l9-7 9 7v11z" /><path d="M10 23v-6h4v6" /></>;
    case "dance":
      return <><circle cx="8" cy="7" r="2.300" /><circle cx="16" cy="7" r="2.300" /><path d="M8 9.500v7l-3 6.500M8 16.500l3 6.500M16 9.500v7l-3 6.500M16 16.500l3 6.500" /><path d="M8 11.500h8" /></>;
    case "briefcase":
      return <><rect x="2" y="10" width="20" height="13" rx="1.500" /><path d="M8.500 10V7h7v3M2 16h20" /></>;
    case "trophy":
      return <><path d="M7 4h10v6c0 3.500-2.200 6-5 6s-5-2.500-5-6z" /><path d="M7 6H3c0 4 2 6 4.500 6M17 6h4c0 4-2 6-4.500 6" /><path d="M12 16v4M8 23h8M9 20h6" /></>;
    case "laptop":
      return <><rect x="4" y="8" width="16" height="11" rx="1" /><path d="M1 23h22l-2-4H3z" /></>;
    case "flag":
      return <><path d="M5 23V3" /><path d="M5 4h14l-3.500 4.500L19 13H5" /></>;
  }
}

function Figure({ age, phase, facing }: { age: number; phase: number; facing: 1 | -1 }) {
  const swing = Math.sin(phase);
  const stroke = { stroke: "var(--ink)", strokeWidth: 2.6, strokeLinecap: "round" as const, fill: "none" };

  if (age < 1.3) {
    // Crawling: body level with the ground, limbs trading places.
    const s = swing * 4;
    return (
      <g transform={`scale(${facing} 1)`}>
        <line x1="-13" y1="-13" x2="7" y2="-15" {...stroke} />
        <line x1="-13" y1="-13" x2={-15 + s} y2="0" {...stroke} />
        <line x1="-9" y1="-13" x2={-9 - s} y2="0" {...stroke} />
        <line x1="5" y1="-15" x2={7 - s} y2="0" {...stroke} />
        <line x1="7" y1="-15" x2={11 + s} y2="0" {...stroke} />
        <circle cx="14" cy="-21" r="8" fill="var(--bg)" stroke="var(--ink)" strokeWidth="2.6" />
      </g>
    );
  }

  const h = heightAt(age);
  const r = 8.5;
  const body = h - 2 * r;
  const leg = body * 0.52;
  const torso = body * 0.48;
  const arm = body * 0.4;
  const hip = -leg;
  const shoulder = hip - torso;
  const step = swing * leg * 0.34;
  const reach = swing * arm * 0.3;
  // A small bob as the feet pass each other.
  const bob = -Math.abs(Math.cos(phase)) * 1.5;
  return (
    <g transform={`translate(0 ${bob}) scale(${facing} 1)`}>
      <line x1="0" y1={hip} x2={step + 3} y2={-bob} {...stroke} />
      <line x1="0" y1={hip} x2={-step - 3} y2={-bob} {...stroke} />
      <line x1="0" y1={hip} x2="0" y2={shoulder} {...stroke} />
      <line x1="0" y1={shoulder + 4} x2={-reach - 5} y2={shoulder + 4 + arm} {...stroke} />
      <line x1="0" y1={shoulder + 4} x2={reach + 5} y2={shoulder + 4 + arm} {...stroke} />
      <circle cx="0" cy={shoulder - r - 1} r={r} fill="var(--bg)" stroke="var(--ink)" strokeWidth="2.6" />
    </g>
  );
}

export function LifeLine() {
  const [p, setP] = useState(0);
  const [width, setWidth] = useState(900);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [inView, setInView] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const held = useRef(0); // -1, 0 or 1 while an arrow key is down
  const target = useRef<number | null>(null);
  const raf = useRef(0);
  const reduced = useRef(false);
  const drag = useRef<{ x: number; p: number } | null>(null);

  const spacing = width < 560 ? 190 : 260;

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const set = useCallback((next: number) => {
    const n = clamp(next);
    if (n !== pos.current) setFacing(n > pos.current ? 1 : -1);
    pos.current = n;
    setP(n);
  }, []);

  // One animation loop serves both held keys and glides to a milestone. It stops itself when idle.
  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (held.current) {
        target.current = null;
        set(pos.current + held.current * SPEED * dt);
      } else if (target.current !== null) {
        const d = target.current - pos.current;
        if (Math.abs(d) < 0.004) {
          set(target.current);
          target.current = null;
        } else {
          set(pos.current + d * Math.min(1, dt * 6));
        }
      }
      if (held.current || target.current !== null) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [set]);

  const goTo = useCallback(
    (index: number) => {
      const n = clamp(index);
      if (reduced.current) return set(n);
      target.current = n;
      run();
    },
    [run, set],
  );

  const hop = useCallback(
    (dir: 1 | -1) => {
      const here = pos.current;
      goTo(dir > 0 ? Math.floor(here + 0.001) + 1 : Math.ceil(here - 0.001) - 1);
    },
    [goTo],
  );

  // Arrow keys work whenever the timeline is on screen, unless the visitor is typing or using another control.
  useEffect(() => {
    if (!inView) return;
    const dirOf = (e: KeyboardEvent) => (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0);
    const busy = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) && !wrap.current?.contains(t);
    };
    const down = (e: KeyboardEvent) => {
      const dir = dirOf(e);
      if (!dir || busy(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (reduced.current) {
        if (!e.repeat) hop(dir as 1 | -1);
        return;
      }
      if (held.current !== dir) {
        held.current = dir;
        run();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (dirOf(e) === held.current) held.current = 0;
    };
    const blur = () => (held.current = 0);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      held.current = 0;
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [inView, hop, run]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const nearest = Math.round(p);
  const current = milestones[nearest];
  const atPost = Math.abs(p - nearest) < 0.18;
  const centre = width / 2;
  const walking = !reduced.current;

  return (
    <div>
      <div
        ref={wrap}
        className="relative cursor-grab touch-pan-y overflow-hidden border-y border-rule select-none active:cursor-grabbing"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, p: pos.current };
          target.current = null;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current) set(drag.current.p - (e.clientX - drag.current.x) / spacing);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <svg viewBox={`0 0 ${width} ${H}`} width="100%" height={H} aria-hidden className="block">
          <g transform={`translate(${centre - p * spacing} 0)`}>
            <line x1={-width} x2={LAST * spacing + width} y1={GROUND} y2={GROUND} stroke="var(--ink)" strokeWidth="1" />
            {/* A tick every quarter of the way between milestones: the rhythm you walk over. */}
            {Array.from({ length: LAST * 4 + 1 }, (_, i) => (
              <line key={i} x1={(i / 4) * spacing} x2={(i / 4) * spacing} y1={GROUND} y2={GROUND + (i % 4 ? 5 : 10)} stroke="var(--muted)" strokeWidth="1" />
            ))}
            {milestones.map((m, i) => {
              const on = i === nearest && atPost;
              const x = i * spacing;
              return (
                <g key={m.title}>
                  <line x1={x} x2={x} y1="52" y2={GROUND} stroke={on ? "var(--accent)" : "var(--rule)"} strokeWidth="1" strokeDasharray="2 4" />
                  <circle cx={x} cy={GROUND} r="4" fill={on ? "var(--accent)" : "var(--bg)"} stroke={on ? "var(--accent)" : "var(--ink)"} strokeWidth="1.5" />
                  <text x={x} y="26" textAnchor="middle" fontSize="10" letterSpacing="0.08em" fill={on ? "var(--accent-text)" : "var(--muted)"} fontFamily="var(--font-mono)">
                    {m.when.toUpperCase()}
                  </text>
                  <text x={x} y="44" textAnchor="middle" fontSize="13" fill={on ? "var(--ink)" : "var(--muted)"} fontFamily="var(--font-sans)">
                    {m.title}
                  </text>
                  <g
                    transform={`translate(${x + 26} ${GROUND - 35}) scale(1.4)`}
                    fill="none"
                    stroke={on ? "var(--accent)" : "var(--muted)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <PropGlyph kind={m.prop} />
                  </g>
                  <text x={x} y={GROUND + 28} textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="var(--font-mono)">
                    {String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </g>
          <g transform={`translate(${centre} ${GROUND})`}>
            <Figure age={ageAt(p)} phase={walking ? p * spacing * 0.085 : 0} facing={facing} />
          </g>
        </svg>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-12 sm:gap-8">
        <div aria-live="polite" className="min-h-[9.5rem] sm:col-span-7">
          <p className="meta">
            <span className="text-accent-text">{String(nearest + 1).padStart(2, "0")}</span> / {String(LAST + 1).padStart(2, "0")}
            {` · ${current.when}`}
          </p>
          <p className="mt-2 font-display text-2xl leading-tight tracking-[-0.01em]">{current.title}</p>
          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-snug text-muted">{current.note}</p>
        </div>
        <div className="sm:col-span-5">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => hop(-1)} disabled={p <= 0} aria-label="Earlier" className="meta grid size-11 place-items-center border border-rule text-ink transition-colors hover:border-ink disabled:opacity-40">
              ←
            </button>
            <button type="button" onClick={() => hop(1)} disabled={p >= LAST} aria-label="Later" className="meta grid size-11 place-items-center border border-rule text-ink transition-colors hover:border-ink disabled:opacity-40">
              →
            </button>
            <input
              type="range"
              min={0}
              max={LAST}
              step={0.01}
              value={p}
              onChange={(e) => {
                target.current = null;
                set(Number(e.target.value));
              }}
              onKeyDown={(e) => {
                // The window listener walks the figure; keep the native slider step from fighting it.
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.preventDefault();
              }}
              aria-label="Position on the timeline"
              aria-valuetext={`${current.title}, ${nearest + 1} of ${LAST + 1}`}
              className="h-11 min-w-0 flex-1 accent-[var(--accent)]"
            />
          </div>
          <p className="meta mt-3 normal-case tracking-normal">
            <span className="max-sm:hidden">Hold ← → to walk, or drag the timeline.</span>
            <span className="sm:hidden">Swipe the timeline, or use the arrows.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
