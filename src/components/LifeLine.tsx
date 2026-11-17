"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BIRTH_YEAR, greetings, milestones, type Prop } from "@/content/life";

/*
 * A walkable biography. The figure stays in the middle and the timeline moves under it; hold the arrow keys,
 * drag, or swipe to walk, and the figure grows from a crawling baby to an adult along the way.
 * Position `p` runs from 0 to milestones.length - 1, so whole numbers are milestones.
 * Under reduced motion nothing glides or swings: each key press or button steps straight to the next milestone.
 */

const LAST = milestones.length - 1;
const SPEED = 0.62; // milestones per second while a key is held
const GLIDE = 1.1; // top speed when walking to a milestone on its own
const EASE = 4.5; // how quickly the walk speeds up and slows down
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

type P = [number, number];
type Placed = { x: number; y: number; s: number; r?: number };
type Act = { hf?: P; hb?: P; ff?: P; fb?: P; hip?: P; prop?: Placed };
type Dims = { A: number; leg: number; sh: number; hipY: number; head: number; h: number };

const R = 8.5; // head radius
const REST: Placed = { x: 42.8, y: -15.4, s: 1.4, r: 0 }; // where a prop stands, relative to its post
const mix = (a: P, b: P, t: number): P => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};

function dimsAt(age: number): Dims {
  const h = heightAt(age);
  const body = h - 2 * R;
  const leg = body * 0.52;
  const sy = -leg - body * 0.48;
  return { A: body * 0.42, leg, sh: sy + 4, hipY: -leg, head: sy - R - 1, h };
}

/*
 * What the figure does with each prop once it is standing at the milestone, facing right, feet at (0, 0).
 * Anything left out keeps the standing pose; a missing `prop` leaves the drawing where it stands.
 */
function actFor(kind: Prop, t: number, { A, leg, sh, hipY, head, h }: Dims): Act {
  const s = Math.sin;
  switch (kind) {
    case "cradle":
      return { prop: { ...REST, r: s(t * 2) * 6 } };
    case "ball": {
      const k = Math.abs(s(t * 3.2));
      const x = leg * 0.5 + 5;
      return {
        prop: { x, y: -6 - k * leg * 0.75, s: 0.7, r: t * 120 },
        ff: [x - 5, -(1 - k) * (1 - k) * leg * 0.4],
        hf: [A * 0.75, sh + A * 0.55],
        hb: [-A * 0.75, sh + A * 0.55],
      };
    }
    case "controller": {
      const x = A * 0.7, y = sh + A * 0.6;
      return { prop: { x, y, s: 0.6 }, hf: [x + 5, y + 2 + s(t * 8)], hb: [x - 5, y + 2 - s(t * 8)] };
    }
    case "keys": {
      const x = A * 0.85 + 10, y = hipY - 4;
      return { prop: { x, y, s: 1 }, hf: [x + 3, y - 6 - 1.5 * s(t * 7)], hb: [x - 6, y - 6 + 1.5 * s(t * 7)] };
    }
    case "book": {
      const x = A * 0.6, y = sh + A * 0.35;
      return { prop: { x, y, s: 0.75, r: s(t * 1.5) * 3 }, hf: [x + 6, y + 6], hb: [x - 6, y + 6] };
    }
    case "cube": {
      const x = A * 0.65, y = sh + A * 0.6, k = s(t * 3);
      return { prop: { x, y, s: 0.55, r: k * 25 }, hf: [x + 5, y + k * 3], hb: [x - 5, y - k * 3] };
    }
    case "note":
      return {
        prop: { x: A * 0.5 + 14 + s(t * 1.3) * 3, y: head - 12 + s(t * 2.2) * 4, s: 0.8, r: s(t * 1.3) * 8 },
        hf: [A * 0.8, sh - A * 0.15 + s(t * 2.2) * A * 0.15],
        hb: [A * 0.25, sh + A * 0.5],
      };
    case "cards": {
      const x = A * 0.75, y = sh + A * 0.15;
      return { prop: { x, y, s: 0.65, r: s(t * 2.5) * 14 }, hf: [x - 2, y + 7], hb: [-A * 0.5, sh + A * 0.75] };
    }
    case "badge":
      return { prop: { x: 0.5, y: sh + A * 0.35, s: 0.45 }, hf: [6, head - 3] };
    case "stage": {
      const sc = (h / 24) * 1.3, y = sh - A * 0.35 + s(t * 2) * 3;
      return { prop: { x: 0, y: -9 * sc, s: sc }, hf: [A * 0.85, y], hb: [-A * 0.85, y] };
    }
    case "cap": {
      const k = Math.max(0, s(t * 2.4));
      return { prop: { x: 0, y: head - R - 3 - k * h * 0.22, s: 0.8, r: k * 25 }, hf: [A * 0.4, sh + A * 0.9 - k * A * 1.7] };
    }
    case "globe": {
      const x = A * 0.8 + 6, y = sh - A * 0.1;
      return { prop: { x, y, s: 0.9, r: s(t * 1.5) * 15 }, hf: [x - 3, y + 10] };
    }
    case "chalk": {
      const x = A * 0.9 + 14, y = sh - 2;
      return { prop: { x, y, s: 1.3 }, hf: [x - 5 + s(t * 2.5) * 6, y - 3 + s(t * 9) * 1.5] };
    }
    case "shoe": {
      const k = s(t * 9), c = Math.cos(t * 9);
      return {
        ff: [k * leg * 0.3, -Math.max(0, c) * leg * 0.35],
        fb: [-k * leg * 0.3, -Math.max(0, -c) * leg * 0.35],
        hf: [A * 0.35 - k * A * 0.3, sh + A * 0.55],
        hb: [-A * 0.1 + k * A * 0.3, sh + A * 0.55],
        hip: [0, -Math.abs(c) * 2],
      };
    }
    case "house":
      return { hf: [A * 0.55 + s(t * 6) * A * 0.22, sh - A * 0.7] };
    case "dance": {
      const k = s(t * 2.6);
      return {
        prop: { ...REST, r: k * 8 },
        hip: [k * 4, 0],
        hf: [A * 0.8, sh - A * 0.2],
        hb: [-A * 0.6, sh + A * 0.1],
        ff: [5 + k * 5, -Math.max(0, k) * 3],
        fb: [-5 + k * 5, -Math.max(0, -k) * 3],
      };
    }
    case "briefcase": {
      const x = 7 + s(t * 2) * 2, y = sh + A + 7;
      return { prop: { x, y, s: 0.7 }, hf: [x, y - 9] };
    }
    case "trophy": {
      const y = head - R - 14 + s(t * 4) * 2;
      return { prop: { x: 0, y, s: 0.95 }, hf: [5, y + 10], hb: [-5, y + 10] };
    }
    case "laptop": {
      const x = A * 0.85 + 8, y = hipY - 6;
      return { prop: { x, y, s: 0.95 }, hf: [x - 2, y + 1 - s(t * 9)], hb: [x - 7, y + 1 + s(t * 9)] };
    }
    case "flag":
      return {
        prop: { x: A * 0.75 + 9.8, y: REST.y, s: 1.4, r: s(t * 2) * 3 },
        hf: [A * 0.75, sh + A * 0.25],
        hb: [-A * 0.5 + s(t * 6) * A * 0.2, sh - A * 0.7],
      };
  }
}

function PropAt({ kind, at, on }: { kind: Prop; at: Placed; on: boolean }) {
  return (
    <g
      transform={`translate(${at.x.toFixed(2)} ${at.y.toFixed(2)}) rotate(${(at.r ?? 0).toFixed(1)}) scale(${at.s.toFixed(3)}) translate(-12 -14)`}
      fill="none"
      stroke={on ? "var(--accent)" : "var(--muted)"}
      strokeWidth={2.1 / at.s}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <PropGlyph kind={kind} />
    </g>
  );
}

/* A limb with one joint: two equal segments from `a` to `b`, bent to one side when `b` is closer than `len`. */
function limb(a: P, b: P, len: number, dir: 1 | -1) {
  let dx = b[0] - a[0];
  let dy = b[1] - a[1];
  let d = Math.hypot(dx, dy) || 0.001;
  const max = len * 0.999;
  if (d > max) {
    dx *= max / d;
    dy *= max / d;
    d = max;
  }
  const rise = Math.sqrt((len * len) / 4 - (d * d) / 4);
  const f = (n: number) => n.toFixed(2);
  return `M${f(a[0])} ${f(a[1])}L${f(a[0] + dx / 2 - (dy / d) * dir * rise)} ${f(a[1] + dy / 2 + (dx / d) * dir * rise)}L${f(a[0] + dx)} ${f(a[1] + dy)}`;
}

/*
 * `phase` drives the walk cycle, `move` (0 to 1) is how much the figure is walking rather than standing,
 * and `act` with weight `w` is the pose for the prop at the nearest milestone.
 */
function Figure({ age, phase, move, facing, act, w }: { age: number; phase: number; move: number; facing: 1 | -1; act: Act; w: number }) {
  const swing = Math.sin(phase);
  const stroke = { stroke: "var(--ink)", strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

  if (age < 1.3) {
    // Crawling: body level with the ground, limbs trading places.
    const s = swing * 4 * move;
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

  const d = dimsAt(age);
  const { A, leg, sh, hipY } = d;
  const c = Math.cos(phase);
  const hang = sh + A * 0.96;
  const stand = { ff: [3, 0] as P, fb: [-3, 0] as P, hf: [5, hang] as P, hb: [-5, hang] as P };
  const walk = {
    ff: [swing * leg * 0.36, -Math.max(0, c) * leg * 0.16] as P,
    fb: [-swing * leg * 0.36, -Math.max(0, -c) * leg * 0.16] as P,
    hf: [-swing * A * 0.4 + 3, hang - Math.abs(swing) * A * 0.1] as P,
    hb: [swing * A * 0.4 - 3, hang - Math.abs(swing) * A * 0.1] as P,
  };
  // Feet only take the prop pose once the figure has slowed down, so they never slide.
  const wf = w * (1 - move);
  const ff = mix(mix(stand.ff, walk.ff, move), act.ff ?? stand.ff, wf);
  const fb = mix(mix(stand.fb, walk.fb, move), act.fb ?? stand.fb, wf);
  const hf = mix(mix(stand.hf, walk.hf, move), act.hf ?? stand.hf, w);
  const hb = mix(mix(stand.hb, walk.hb, move), act.hb ?? stand.hb, w);
  const off = act.hip ?? [0, 0];
  const ox = off[0] * wf;
  const oy = off[1] * wf - Math.abs(c) * 1.5 * move;
  const hip: P = [ox, hipY * 0.98 + oy];
  const shoulder: P = [ox, sh + oy];
  return (
    <g transform={`scale(${facing} 1)`}>
      <path d={limb(shoulder, [hb[0], hb[1]], A, 1)} {...stroke} />
      <path d={limb(hip, fb, leg, -1)} {...stroke} />
      <path d={limb(hip, ff, leg, -1)} {...stroke} />
      <line x1={hip[0]} y1={hip[1]} x2={shoulder[0]} y2={shoulder[1] - 4} {...stroke} />
      <path d={limb(shoulder, hf, A, 1)} {...stroke} />
      <circle cx={ox} cy={d.head + oy} r={R} fill="var(--bg)" stroke="var(--ink)" strokeWidth="2.6" />
    </g>
  );
}

// Where each greeting sits on the timeline, worked out from its year.
const hellos = greetings.map((g) => {
  let i = 0;
  while (i < LAST - 1 && milestones[i + 1].year < g.year) i++;
  return { ...g, at: i + (g.year - milestones[i].year) / (milestones[i + 1].year - milestones[i].year) };
});

function Bubble({ text, opacity }: { text: string; opacity: number }) {
  const wide = text.length * 8.2 + 22;
  return (
    <g opacity={opacity}>
      <path
        d={`M${-wide / 2 + 6} -26h${wide - 12}a6 6 0 0 1 6 6v14a6 6 0 0 1 -6 6h${-(wide / 2 - 12)}l-6 7v-7h${-(wide / 2 - 12)}a6 6 0 0 1 -6 -6v-14a6 6 0 0 1 6 -6z`}
        fill="var(--bg)"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text x="0" y="-8" textAnchor="middle" fontSize="14" fill="var(--ink)" fontFamily="var(--font-sans)">
        {text}
      </text>
    </g>
  );
}

export function LifeLine() {
  const [f, setF] = useState<{ p: number; t: number; move: number; facing: 1 | -1 }>({ p: 0, t: 0, move: 0, facing: 1 });
  const [width, setWidth] = useState(900);
  const [inView, setInView] = useState(false);
  const [still, setStill] = useState(false); // reduced motion
  const wrap = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const vel = useRef(0);
  const speed = useRef(0);
  const clock = useRef(0);
  const dir = useRef<1 | -1>(1);
  const held = useRef(0); // -1, 0 or 1 while an arrow key is down
  const target = useRef<number | null>(null);
  const reduced = useRef(false);
  const drag = useRef<{ x: number; p: number } | null>(null);

  const spacing = width < 560 ? 190 : 260;

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduced.current);
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

  // Move straight to a position (drag, slider, reduced motion). The loop below picks it up from the refs.
  const set = useCallback((next: number) => {
    const n = clamp(next);
    if (n !== pos.current) dir.current = n > pos.current ? 1 : -1;
    pos.current = n;
    vel.current = 0;
    setF((prev) => ({ ...prev, p: n, facing: dir.current }));
  }, []);

  // One loop while the timeline is on screen: it eases the walking speed up and down and keeps the props moving.
  useEffect(() => {
    if (!inView || still) return;
    let raf = 0;
    let last = performance.now();
    let prev = pos.current;
    const tick = (now: number) => {
      const dt = Math.max(0.001, Math.min(0.05, (now - last) / 1000));
      last = now;
      clock.current += dt;
      let want = 0;
      if (drag.current) {
        vel.current = 0;
      } else if (held.current) {
        target.current = null;
        want = held.current * SPEED;
      } else if (target.current !== null) {
        const d = target.current - pos.current;
        if (Math.abs(d) < 0.003) {
          pos.current = target.current;
          target.current = null;
          vel.current = 0;
        } else {
          want = Math.max(-GLIDE, Math.min(GLIDE, d * 3.2));
        }
      }
      if (!drag.current) {
        vel.current += (want - vel.current) * Math.min(1, dt * EASE);
        if (Math.abs(vel.current) < 0.0005) vel.current = 0;
        const n = clamp(pos.current + vel.current * dt);
        if (n !== pos.current) dir.current = n > pos.current ? 1 : -1;
        pos.current = n;
      }
      speed.current += (Math.abs(pos.current - prev) / dt - speed.current) * Math.min(1, dt * 8);
      prev = pos.current;
      setF({ p: pos.current, t: clock.current, move: Math.min(1, speed.current / 0.3), facing: dir.current });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, still]);

  const goTo = useCallback(
    (index: number) => {
      const n = clamp(index);
      if (reduced.current) return set(n);
      target.current = n;
    },
    [set],
  );

  const hop = useCallback(
    (d: 1 | -1) => {
      const here = target.current ?? pos.current;
      goTo(d > 0 ? Math.floor(here + 0.001) + 1 : Math.ceil(here - 0.001) - 1);
    },
    [goTo],
  );

  // Arrow keys work whenever the timeline is on screen, unless the visitor is typing or using another control.
  useEffect(() => {
    if (!inView) return;
    const dirOf = (e: KeyboardEvent) => (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0);
    const busy = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) && !root.current?.contains(t);
    };
    // Letting go close to a milestone finishes the walk there, so the figure ends up at the prop.
    const release = () => {
      held.current = 0;
      const near = Math.round(pos.current);
      if (Math.abs(pos.current - near) < 0.3) target.current = near;
    };
    const down = (e: KeyboardEvent) => {
      const d = dirOf(e);
      if (!d || busy(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (reduced.current) {
        if (!e.repeat) hop(d as 1 | -1);
        return;
      }
      held.current = d;
    };
    const up = (e: KeyboardEvent) => {
      if (held.current && dirOf(e) === held.current) release();
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
  }, [inView, hop]);

  const { p, t, move, facing } = f;
  const nearest = Math.round(p);
  const current = milestones[nearest];
  const atPost = Math.abs(p - nearest) < 0.18;
  const centre = width / 2;
  const age = ageAt(p);
  // How fully the figure is "at" the nearest milestone: 1 on the post, fading out by a third of the way to the next.
  const w = smooth((0.32 - Math.abs(p - nearest)) / 0.24);
  const act = actFor(current.prop, t, dimsAt(Math.max(1.3, age)));
  const rest: Placed = { ...REST, x: (nearest - p) * spacing + REST.x };
  const to = act.prop ?? REST;
  const prop: Placed = { x: lerp(rest.x, to.x, w), y: lerp(rest.y, to.y, w), s: lerp(rest.s, to.s, w), r: (to.r ?? 0) * w };
  const headTop = age < 1.3 ? -30 : dimsAt(age).head - R;

  return (
    <div ref={root}>
      <div
        ref={wrap}
        className="relative cursor-grab touch-pan-y overflow-hidden border-y border-rule select-none active:cursor-grabbing"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, p: pos.current };
          target.current = null;
          held.current = 0;
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
                  {i !== nearest && (
                    <g transform={`translate(${x + 26} ${GROUND - 35}) scale(1.4)`} fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <PropGlyph kind={m.prop} />
                    </g>
                  )}
                  <text x={x} y={GROUND + 28} textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="var(--font-mono)">
                    {String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
            {hellos.map((g) => (
              <g key={g.language}>
                <text x={g.at * spacing} y={GROUND + 28} textAnchor="middle" fontSize="10" letterSpacing="0.08em" fill="var(--muted)" fontFamily="var(--font-mono)">
                  {g.language.toUpperCase()}
                </text>
                {still && (
                  <g transform={`translate(${g.at * spacing} ${GROUND - 112})`}>
                    <Bubble text={g.hello} opacity={1} />
                  </g>
                )}
              </g>
            ))}
          </g>
          <g transform={`translate(${centre} ${GROUND})`}>
            {current.prop === "stage" && <PropAt kind="stage" at={prop} on={atPost} />}
            <Figure age={age} phase={still ? 0 : p * spacing * 0.05} move={still ? 0 : move} facing={w > 0.3 ? 1 : facing} act={act} w={w} />
            {current.prop !== "stage" && <PropAt kind={current.prop} at={prop} on={atPost} />}
            {!still &&
              hellos.map((g) => {
                const o = smooth((0.26 - Math.abs(p - g.at)) / 0.1);
                return o > 0 ? (
                  <g key={g.language} transform={`translate(0 ${headTop - 12})`}>
                    <Bubble text={g.hello} opacity={o} />
                  </g>
                ) : null;
              })}
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
            <span className="max-sm:hidden">Hold ← → to walk, or drag the timeline. Stop at a milestone to see it come to life.</span>
            <span className="sm:hidden">Swipe the timeline, or use the arrows.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
