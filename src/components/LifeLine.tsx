"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { milestones } from "@/content/life";

/*
 * A walkable biography. The figure stays in the middle and the timeline moves under it; hold the arrow keys,
 * drag, or swipe to walk, and the figure grows from a crawling baby to an adult along the way.
 * Position `p` runs from 0 to milestones.length - 1, so whole numbers are milestones.
 * Under reduced motion nothing glides or swings: each key press or button steps straight to the next milestone.
 */

const LAST = milestones.length - 1;
const SPEED = 1.15; // milestones per second while a key is held
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
  return lerp(milestones[i].figureAge, milestones[i + 1].figureAge, p - i);
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
                    {String(i + 1).padStart(2, "0")}{m.when ? ` · ${m.when.toUpperCase()}` : ""}
                  </text>
                  <text x={x} y="44" textAnchor="middle" fontSize="13" fill={on ? "var(--ink)" : "var(--muted)"} fontFamily="var(--font-sans)">
                    {m.title}
                  </text>
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
        <div aria-live="polite" className="min-h-[6.5rem] sm:col-span-7">
          <p className="meta">
            <span className="text-accent-text">{String(nearest + 1).padStart(2, "0")}</span> / {String(LAST + 1).padStart(2, "0")}
            {current.when && ` · ${current.when}`}
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
