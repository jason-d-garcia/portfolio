"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { BIRTH_YEAR, greetings, milestones, type Prop } from "@/content/life";

/*
 * A biography you move through. The figure stays in the middle while the years pass under it, and it never
 * stops to stand next to an object: each milestone is a small scene it acts out (sitting at the piano,
 * juggling a ball, dancing with a partner), and the scenes melt into one another as you travel.
 * Position `p` runs from 0 to milestones.length - 1, so whole numbers are milestones.
 * Under reduced motion nothing animates: each key press or button shows the next scene as a still.
 */

const LAST = milestones.length - 1;
const H = 310;
const GROUND = 252;
const ZOOM = 1.2;
const PLAY = 1.1; // milestones per second when it plays on its own
const GLIDE = 2.6; // top speed when stepping to a milestone
const clamp = (n: number) => Math.max(0, Math.min(LAST, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (x: number) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
const rand = (i: number, k: number) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
// The ground rolls a little instead of running ruler-straight.
const hill = (x: number) => 4 * Math.sin(x / 150) + 2.5 * Math.sin(x / 47 + 1.3);

type P = [number, number];
type Pose = { hip: P; sh: P; hf: P; hb: P; ff: P; fb: P };
type Item = { g: string; x: number; y: number; s: number; r?: number; o?: number; text?: boolean };
type Scene = { pose: Pose; items?: Item[]; partner?: Pose };
type Dims = { A: number; L: number; T: number; r: number };

const mix = (a: P, b: P, t: number): P => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const mixPose = (a: Pose, b: Pose, t: number, hands = t): Pose => ({
  hip: mix(a.hip, b.hip, t),
  sh: mix(a.sh, b.sh, t),
  ff: mix(a.ff, b.ff, t),
  fb: mix(a.fb, b.fb, t),
  hf: mix(a.hf, b.hf, hands),
  hb: mix(a.hb, b.hb, hands),
});

// Height of the figure in px for an age, between hand-set anchors.
const HEIGHTS: [number, number][] = [[0, 30], [2, 40], [4, 50], [10, 70], [16, 90], [20, 96], [30, 96]];
function dimsAt(age: number): Dims {
  let h = 96;
  for (let i = 1; i < HEIGHTS.length; i++) {
    const [a1, h1] = HEIGHTS[i];
    const [a0, h0] = HEIGHTS[i - 1];
    if (age <= a1) {
      h = lerp(h0, h1, (age - a0) / (a1 - a0));
      break;
    }
  }
  const r = lerp(6.5, 8.5, Math.max(0, Math.min(1, age / 10)));
  const body = h - 2 * r;
  return { A: body * 0.42, L: body * 0.52, T: body * 0.48, r };
}

function ageAt(p: number) {
  const i = Math.min(LAST - 1, Math.floor(p));
  return lerp(milestones[i].year, milestones[i + 1].year, p - i) - BIRTH_YEAR;
}

/* Small line drawings, each in a 24 x 24 box that is placed by its middle (12, 14). */
const GLYPH: Record<string, ReactNode> = {
  cradle: <><path d="M3 12h18l-2 8H5z" /><path d="M2 24c3-3 17-3 20 0" /><path d="M3 12c0-5 4-7 8-7" /></>,
  ball: <><circle cx="12" cy="14" r="8.5" /><path d="M12 9.5l4.3 3.1-1.6 5h-5.4l-1.6-5z" /></>,
  controller: <><rect x="2" y="9" width="20" height="11" rx="4" /><path d="M7 12.5v4M5 14.5h4" /><circle cx="16" cy="13.5" r="0.9" /><circle cx="18.5" cy="16" r="0.9" /></>,
  keys: <><rect x="2" y="9" width="20" height="10" /><path d="M7 9v10M12 9v10M17 9v10" /><path d="M5.5 9v6h3V9M10.5 9v6h3V9M15.5 9v6h3V9" /><path d="M4 19v5M20 19v5" /></>,
  book: <><path d="M12 9c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V8c-3-1-6-1-9 1z" /><path d="M12 9v14" /></>,
  cube: <><rect x="4" y="6" width="16" height="16" /><path d="M9.3 6v16M14.7 6v16M4 11.3h16M4 16.7h16" /></>,
  note: <><ellipse cx="7" cy="20" rx="3.5" ry="2.6" /><ellipse cx="18" cy="17" rx="3.5" ry="2.6" /><path d="M10.5 20V6l11-3v14" /><path d="M10.5 10l11-3" /></>,
  cards: <><rect x="4" y="8" width="11" height="15" rx="1.5" transform="rotate(-10 9.5 15.5)" /><rect x="10" y="7" width="11" height="15" rx="1.5" transform="rotate(10 15.5 14.5)" /></>,
  badge: <><path d="M12 4l7 3v7c0 5-3.5 8-7 9.5C8.5 22 5 19 5 14V7z" /><path d="M9 13.5l2.2 2.2 4-4.5" /></>,
  stage: <><path d="M2 5h20v18" /><path d="M2 5v18" /><path d="M2 5c2 6 2 10 5 13M22 5c-2 6-2 10-5 13" /><path d="M1 23h22" /></>,
  cap: <><path d="M1 12l11-5 11 5-11 5z" /><path d="M6 14.5v5c3 2.5 9 2.5 12 0v-5" /><path d="M23 12v7" /></>,
  globe: <><circle cx="12" cy="14" r="9" /><path d="M3 14h18M12 5c-4 3-4 15 0 18M12 5c4 3 4 15 0 18" /></>,
  chalk: <><rect x="2" y="6" width="20" height="13" /><path d="M6 11h7M6 14.5h11" /><path d="M8 19l-2 5M16 19l2 5" /></>,
  house: <><path d="M3 23V12l9-7 9 7v11z" /><path d="M10 23v-6h4v6" /></>,
  briefcase: <><rect x="2" y="10" width="20" height="13" rx="1.5" /><path d="M8.5 10V7h7v3M2 16h20" /></>,
  trophy: <><path d="M7 4h10v6c0 3.5-2.2 6-5 6s-5-2.5-5-6z" /><path d="M7 6H3c0 4 2 6 4.5 6M17 6h4c0 4-2 6-4.5 6" /><path d="M12 16v4M8 23h8M9 20h6" /></>,
  laptop: <><rect x="4" y="6" width="16" height="11" rx="1" /><path d="M1 21h22l-2-4H3z" /></>,
  flag: <><path d="M5 23V3" /><path d="M5 4h14l-3.5 4.5L19 13H5" /></>,
  stool: <><path d="M9.5 14h5" /><path d="M10 14l-0.5 9M14 14l0.5 9" /></>,
};
const BEHIND = new Set(["stage", "house", "stool"]);

const stand = ({ A, L, T }: Dims): Pose => ({
  hip: [0, -L * 0.98],
  sh: [0, -L - T],
  hf: [5, -L - T + A * 0.96],
  hb: [-5, -L - T + A * 0.96],
  ff: [3, 0],
  fb: [-3, 0],
});

function walkPose(d: Dims, phase: number): Pose {
  const { A, L, T } = d;
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  const bob = -Math.abs(c) * 1.5;
  const hang = -L - T + A * 0.9 + bob;
  return {
    hip: [0, -L * 0.98 + bob],
    sh: [2, -L - T + bob],
    ff: [s * L * 0.42, -Math.max(0, c) * L * 0.18],
    fb: [-s * L * 0.42, -Math.max(0, -c) * L * 0.18],
    hf: [-s * A * 0.5 + 3, hang - Math.abs(s) * A * 0.12],
    hb: [s * A * 0.5 - 3, hang - Math.abs(s) * A * 0.12],
  };
}

const seated = ({ A, L, T }: Dims, seat: number): Pose => ({
  hip: [-4, -seat],
  sh: [-2, -seat - T],
  ff: [L * 0.5, 0],
  fb: [L * 0.36, 0],
  hf: [A * 0.5, -seat - 3],
  hb: [A * 0.3, -seat - 3],
});

// A few of the same thing drifting up and fading: notes while singing, symbols while thinking.
function rising(t: number, x: number, y: number, glyphs: string[], text = false): Item[] {
  return glyphs.map((g, k) => {
    const u = (t * 0.45 + k / glyphs.length) % 1;
    return { g, text, x: x + u * 20 + Math.sin(u * 6 + k * 2) * 4, y: y - u * 38, s: text ? 1 : 0.5, r: Math.sin(u * 5 + k) * 12, o: Math.sin(Math.PI * u) };
  });
}

/* What the figure is doing at each kind of milestone, facing right with the ground at y = 0. */
function scene(kind: Prop, t: number, d: Dims): Scene {
  const { A, L, T, r } = d;
  const s = Math.sin;
  const st = stand(d);
  const sy = -L - T;
  const head = sy - r - 1;
  switch (kind) {
    case "cradle": {
      const c = s(t * 4) * 2;
      return {
        pose: { hip: [-6, -L * 0.7], sh: [-6 + T, -L * 0.7 - 1], hf: [T - 3 + c, 0], hb: [T - 8 - c, 0], ff: [-10 - c, 0], fb: [-5 + c, 0] },
        items: [{ g: "cradle", x: 36, y: -13, s: 1.3, r: s(t * 2) * 6 }],
      };
    }
    case "ball": {
      const k = Math.abs(s(t * 3.2));
      const x = L * 0.5 + 5;
      return {
        pose: { ...st, ff: [x - 5, -(1 - k) * (1 - k) * L * 0.4], hf: [A * 0.75, sy + A * 0.55], hb: [-A * 0.75, sy + A * 0.55] },
        items: [{ g: "ball", x, y: -6 - k * L * 0.75, s: 0.65, r: t * 120 }],
      };
    }
    case "kick": {
      const k = s(t * 3);
      const a = k * 0.9 + 0.2;
      const u = Math.max(0, k);
      return {
        pose: {
          ...st,
          sh: [-3 - k * 3, sy],
          ff: [s(a) * L * 0.95, -L * 0.98 + Math.cos(a) * L * 0.95],
          hf: [-A * 0.3 - k * A * 0.4, sy + A * 0.6],
          hb: [A * 0.4 + k * A * 0.4, sy + A * 0.5],
        },
        items: [{ g: "ball", x: L * 0.9 + 6 + u * 36, y: -6 - u * 28, s: 0.65, r: t * 220 }],
      };
    }
    case "controller": {
      const x = A * 0.7, y = -3 - T + A * 0.6;
      return {
        pose: { hip: [-4, -3], sh: [-6, -3 - T], ff: [L * 0.85, -1], fb: [L * 0.7, 0], hf: [x + 4, y + 2 + s(t * 8)], hb: [x - 4, y + 2 - s(t * 8)] },
        items: [{ g: "controller", x, y, s: 0.6 }],
      };
    }
    case "book": {
      const x = A * 0.6, y = -3 - T + A * 0.3;
      return {
        pose: { hip: [-4, -3], sh: [-5, -3 - T], ff: [L * 0.8, -1], fb: [L * 0.55, 0], hf: [x + 6, y + 6], hb: [x - 5, y + 6] },
        items: [{ g: "book", x, y, s: 0.75, r: s(t * 1.5) * 3 }],
      };
    }
    case "keys":
    case "recital":
    case "arrange": {
      const big = kind === "recital";
      const seat = L * 0.72;
      const sway = s(t * 2) * (big ? 4 : 1.5);
      const x = A * 0.7 + 11, y = -seat - T * 0.2;
      const amp = big ? 4 : 1.8;
      return {
        pose: { ...seated(d, seat), sh: [-2 + sway, -seat - T], hf: [x - 8 + sway * 0.5, y - 9 - amp * s(t * 7)], hb: [x - 13 + sway * 0.5, y - 9 + amp * s(t * 7)] },
        items: [
          { g: "stool", x: -4, y: -seat, s: seat / 9 },
          { g: "keys", x, y, s: 1.5 },
          ...(kind === "keys" ? [] : rising(t, x, y - 16, ["note", "note", "note"])),
        ],
      };
    }
    case "cube": {
      const x = A * 0.65, y = sy + A * 0.6, k = s(t * 3);
      return { pose: { ...st, hf: [x + 5, y + k * 3], hb: [x - 5, y - k * 3] }, items: [{ g: "cube", x, y, s: 0.55, r: k * 25 }] };
    }
    case "note": {
      const k = s(t * 2.2);
      return {
        pose: { ...st, sh: [-2, sy], hf: [A * 0.75, sy + A * 0.25 - k * A * 0.1], hb: [-A * 0.75, sy + A * 0.25 + k * A * 0.1] },
        items: rising(t, r + 6, head - 4, ["note", "note", "note"]),
      };
    }
    case "cards": {
      const x = A * 0.75, y = sy + A * 0.15;
      return { pose: { ...st, hf: [x - 2, y + 7], hb: [-A * 0.5, sy + A * 0.75] }, items: [{ g: "cards", x, y, s: 0.65, r: s(t * 2.5) * 14 }] };
    }
    case "badge":
      return { pose: { ...st, hf: [6, head - 3] }, items: [{ g: "badge", x: 0.5, y: sy + A * 0.35, s: 0.45 }] };
    case "stage": {
      const k = s(t * 5);
      const sc = ((L + T + 2 * r) / 24) * 1.3;
      const up = Math.max(0, k), dn = Math.max(0, -k);
      return {
        pose: {
          hip: [0, -L * 0.98 - Math.abs(k) * 2],
          sh: [k * 2, sy - Math.abs(k) * 2],
          ff: [3 + up * L * 0.5, -up * L * 0.3],
          fb: [-3 - dn * L * 0.5, -dn * L * 0.3],
          hf: [A * 0.8, sy - A * 0.4 + k * 5],
          hb: [-A * 0.8, sy - A * 0.4 - k * 5],
        },
        items: [{ g: "stage", x: 0, y: -9 * sc, s: sc }],
      };
    }
    case "cap": {
      const k = Math.max(0, s(t * 2.4));
      return {
        pose: { ...st, hf: [A * 0.4, sy + A * 0.9 - k * A * 1.7] },
        items: [{ g: "cap", x: 0, y: head - r - 3 - k * (L + T) * 0.3, s: 0.8, r: k * 25 }],
      };
    }
    case "globe": {
      const x = A * 0.8 + 6, y = sy - A * 0.1;
      return { pose: { ...st, hf: [x - 3, y + 10] }, items: [{ g: "globe", x, y, s: 0.9, r: s(t * 1.5) * 15 }] };
    }
    case "chalk": {
      const x = A * 0.9 + 14, y = sy - 2;
      return { pose: { ...st, hf: [x - 5 + s(t * 2.5) * 6, y - 3 + s(t * 9) * 1.5] }, items: [{ g: "chalk", x, y, s: 1.3 }] };
    }
    case "run": {
      const k = s(t * 9), c = Math.cos(t * 9);
      return {
        pose: {
          hip: [0, -L * 0.96 - Math.abs(c) * 2],
          sh: [6, sy + 2 - Math.abs(c) * 2],
          ff: [k * L * 0.5, -Math.max(0, c) * L * 0.4],
          fb: [-k * L * 0.5, -Math.max(0, -c) * L * 0.4],
          hf: [6 + A * 0.4 - k * A * 0.35, sy + A * 0.5],
          hb: [6 - A * 0.2 + k * A * 0.35, sy + A * 0.5],
        },
      };
    }
    case "math":
      return { pose: { ...st, hf: [5, head + r * 0.7], hb: [3, sy + A * 0.55] }, items: rising(t, r + 8, head - 2, ["π", "∑", "∫"], true) };
    case "house":
      return { pose: { ...st, hf: [A * 0.55 + s(t * 6) * A * 0.22, sy - A * 0.7] }, items: [{ g: "house", x: -38, y: -17, s: 1.9 }] };
    case "dance": {
      const k = s(t * 2.6);
      const join: P = [4 + k * 4, sy - A * 0.45];
      const up = Math.max(0, k), dn = Math.max(0, -k);
      return {
        pose: { hip: [-10 + k * 4, -L * 0.98], sh: [-10 + k * 5, sy], hf: join, hb: [15 + k * 4, sy + A * 0.5], ff: [-7 + k * 5, -up * 3], fb: [-13 + k * 5, -dn * 3] },
        partner: { hip: [17 + k * 4, -L * 0.93], sh: [17 + k * 5, sy + 5], hf: join, hb: [-8 + k * 5, sy + 5], ff: [14 + k * 5, -up * 3], fb: [20 + k * 5, -dn * 3] },
      };
    }
    case "briefcase": {
      const x = 7 + s(t * 2) * 2, y = sy + A + 7;
      return { pose: { ...st, hf: [x, y - 9] }, items: [{ g: "briefcase", x, y, s: 0.7 }] };
    }
    case "trophy": {
      const y = head - r - 14 + s(t * 4) * 2;
      return { pose: { ...st, hf: [5, y + 10], hb: [-5, y + 10] }, items: [{ g: "trophy", x: 0, y, s: 0.95 }] };
    }
    case "laptop": {
      const seat = L * 0.72;
      const x = L * 0.34, y = -seat - 9;
      return {
        pose: { ...seated(d, seat), hf: [x + 1, y + 5 - s(t * 9)], hb: [x - 5, y + 5 + s(t * 9)] },
        items: [{ g: "stool", x: -4, y: -seat, s: seat / 9 }, { g: "laptop", x, y, s: 0.9 }],
      };
    }
    default:
      // "flag": the last stop, waving beside a planted flag.
      return {
        pose: { ...st, hf: [A * 0.75, sy + A * 0.25], hb: [-A * 0.5 + s(t * 6) * A * 0.2, sy - A * 0.7] },
        items: [{ g: "flag", x: A * 0.75 + 9.8, y: -12.6, s: 1.4, r: s(t * 2) * 3 }],
      };
  }
}

/* A limb with one joint: two equal segments from `a` to `b`, bent to one side when `b` is closer than `len`. */
function limb(a: P, b: P, len: number, dir: number) {
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

function headOf(pose: Pose, r: number): P {
  const dx = pose.sh[0] - pose.hip[0];
  const dy = pose.sh[1] - pose.hip[1];
  const n = Math.hypot(dx, dy) || 1;
  return [pose.sh[0] + (dx / n) * (r + 1), pose.sh[1] + (dy / n) * (r + 1)];
}

/* `turn` is 1 for the figure itself and -1 for a partner facing it, whose joints bend the other way. */
function Body({ pose, d, turn = 1, color = "var(--ink)", opacity = 1 }: { pose: Pose; d: Dims; turn?: 1 | -1; color?: string; opacity?: number }) {
  const stroke = { stroke: color, strokeWidth: 2.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const head = headOf(pose, d.r);
  if (opacity <= 0.01) return null;
  return (
    <g opacity={opacity}>
      <path d={limb(pose.sh, pose.hb, d.A, turn)} {...stroke} />
      <path d={limb(pose.hip, pose.fb, d.L, -turn)} {...stroke} />
      <path d={limb(pose.hip, pose.ff, d.L, -turn)} {...stroke} />
      <line x1={pose.hip[0]} y1={pose.hip[1]} x2={pose.sh[0]} y2={pose.sh[1]} {...stroke} />
      <path d={limb(pose.sh, pose.hf, d.A, turn)} {...stroke} />
      <circle cx={head[0]} cy={head[1]} r={d.r} fill="var(--bg)" stroke={color} strokeWidth="2.6" />
    </g>
  );
}

function Thing({ item, w }: { item: Item; w: number }) {
  const o = (item.o ?? 1) * w;
  if (o <= 0.01) return null;
  const sc = item.s * lerp(0.4, 1, w);
  if (item.text) {
    return (
      <text x={item.x} y={item.y} opacity={o} textAnchor="middle" fontSize={15 * sc} fill="var(--accent-text)" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
        {item.g}
      </text>
    );
  }
  return (
    <g
      opacity={o}
      transform={`translate(${item.x.toFixed(2)} ${item.y.toFixed(2)}) rotate(${(item.r ?? 0).toFixed(1)}) scale(${sc.toFixed(3)}) translate(-12 -14)`}
      fill="none"
      stroke="var(--accent)"
      strokeWidth={1.8 / sc}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLYPH[item.g]}
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
      <text x="0" y="-8" textAnchor="middle" fontSize="14" fill="var(--ink)" style={{ fontFamily: "var(--font-sans)" }}>
        {text}
      </text>
    </g>
  );
}

type Frame = { p: number; t: number; move: number; face: number; phase: number };

export function LifeLine() {
  const [f, setF] = useState<Frame>({ p: 0, t: 0, move: 0, face: 1, phase: 0 });
  const [width, setWidth] = useState(900);
  const [inView, setInView] = useState(false);
  const [still, setStill] = useState(false); // reduced motion
  const [playing, setPlaying] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const vel = useRef(0);
  const speed = useRef(0);
  const clock = useRef(0);
  const phase = useRef(0);
  const face = useRef(1);
  const dir = useRef<1 | -1>(1);
  const held = useRef(0); // -1, 0 or 1 while an arrow key is down
  const heldFor = useRef(0);
  const auto = useRef(false);
  const target = useRef<number | null>(null);
  const reduced = useRef(false);
  const drag = useRef<{ x: number; p: number } | null>(null);

  const spacing = width < 560 ? 190 : 230;

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduced.current);
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const stopPlay = useCallback(() => {
    auto.current = false;
    setPlaying(false);
  }, []);

  // Move straight to a position (drag, slider, reduced motion). The loop below picks it up from the refs.
  const set = useCallback((next: number) => {
    const n = clamp(next);
    if (n !== pos.current) dir.current = n > pos.current ? 1 : -1;
    pos.current = n;
    vel.current = 0;
    setF((prev) => ({ ...prev, p: n }));
  }, []);

  // One loop while the timeline is on screen: it eases the travelling speed and keeps the scenes alive.
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
        // Holding a key starts at a stroll and picks up, so a long hold covers the years quickly.
        heldFor.current += dt;
        target.current = null;
        want = held.current * lerp(1, 2.4, smooth(heldFor.current / 1.6));
      } else if (auto.current) {
        want = PLAY;
        if (pos.current >= LAST) {
          auto.current = false;
          setPlaying(false);
        }
      } else if (target.current !== null) {
        const d = target.current - pos.current;
        if (Math.abs(d) < 0.003) {
          pos.current = target.current;
          target.current = null;
          vel.current = 0;
        } else {
          want = Math.max(-GLIDE, Math.min(GLIDE, d * 5));
        }
      }
      if (!drag.current) {
        vel.current += (want - vel.current) * Math.min(1, dt * 6);
        if (Math.abs(vel.current) < 0.0005) vel.current = 0;
        const n = clamp(pos.current + vel.current * dt);
        if (n !== pos.current) dir.current = n > pos.current ? 1 : -1;
        pos.current = n;
      }
      speed.current += (Math.abs(pos.current - prev) / dt - speed.current) * Math.min(1, dt * 8);
      prev = pos.current;
      const move = Math.min(1, speed.current / 0.7);
      // The stride keeps its own unhurried rhythm however fast the years go by.
      phase.current += dt * 8.5 * Math.min(1, move * 2);
      face.current += (dir.current - face.current) * Math.min(1, dt * 10);
      setF({ p: pos.current, t: clock.current, move, face: face.current, phase: phase.current });
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
      stopPlay();
      const here = target.current ?? pos.current;
      goTo(d > 0 ? Math.floor(here + 0.001) + 1 : Math.ceil(here - 0.001) - 1);
    },
    [goTo, stopPlay],
  );

  // Arrow keys work whenever the timeline is on screen, unless the visitor is typing or using another control.
  useEffect(() => {
    if (!inView) return;
    const dirOf = (e: KeyboardEvent) => (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0);
    const busy = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) && !root.current?.contains(t);
    };
    const down = (e: KeyboardEvent) => {
      const d = dirOf(e);
      if (!d || busy(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (reduced.current) {
        if (!e.repeat) hop(d as 1 | -1);
        return;
      }
      if (held.current !== d) {
        heldFor.current = 0;
        stopPlay();
      }
      held.current = d;
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
  }, [inView, hop, stopPlay]);

  const { p, t, phase: ph } = f;
  const move = still ? 0 : f.move;
  const nearest = Math.round(p);
  const current = milestones[nearest];
  const centre = width / 2;
  const d = dimsAt(ageAt(p));

  // Blend the scene behind us into the one ahead. Each scene holds for a while around its milestone.
  const i = Math.min(LAST - 1, Math.floor(p));
  const k = smooth((p - i - 0.22) / 0.56);
  const from = scene(milestones[i].prop, t, d);
  const to = scene(milestones[i + 1].prop, t + 1.7, d);
  const stride = smooth(move) * 0.85;
  const pose = mixPose(mixPose(from.pose, to.pose, k), walkPose(d, ph), stride, stride * 0.4);
  const dim = 1 - stride * 0.5;
  const head = headOf(pose, d.r);
  const turn = Math.abs(f.face) < 0.1 ? (f.face < 0 ? -0.1 : 0.1) : f.face;
  const x0 = p * spacing;
  const ground: string[] = [];
  for (let x = Math.floor((x0 - centre) / 24) * 24 - 24; x <= x0 + centre + 24; x += 24) ground.push(`${ground.length ? "L" : "M"}${x} ${(GROUND + hill(x)).toFixed(1)}`);
  const things = (sc: Scene, w: number, behind: boolean, key: string) =>
    sc.items?.filter((it) => BEHIND.has(it.g) === behind).map((it, n) => <Thing key={key + n} item={it} w={w * dim} />);

  return (
    <div ref={root}>
      <div
        ref={wrap}
        className="relative cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, p: pos.current };
          target.current = null;
          held.current = 0;
          stopPlay();
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag.current) set(drag.current.p - (e.clientX - drag.current.x) / spacing);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <svg viewBox={`0 0 ${width} ${H}`} width="100%" height={H} aria-hidden className="block">
          <g transform={`translate(${(centre - x0).toFixed(2)} 0)`}>
            <path d={ground.join("")} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {milestones.map((m, n) => {
              const x = n * spacing;
              if (Math.abs(x - x0) > centre + 160) return null;
              // Names sit at loose heights and tilts, and swell as you reach them.
              const near = smooth(1 - Math.abs(n - p) / 0.7);
              const y = 30 + (n % 2) * 40 + rand(n, 1) * 10;
              return (
                <g key={m.title} transform={`translate(${x} ${y.toFixed(1)}) rotate(${((rand(n, 2) - 0.5) * 6).toFixed(1)}) scale(${lerp(0.82, 1.12, near).toFixed(3)})`} opacity={lerp(0.4, 1, near).toFixed(3)}>
                  <text textAnchor="middle" fontSize="19" fill="var(--ink)" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                    {m.title}
                  </text>
                  <text y="17" textAnchor="middle" fontSize="11" fill={near > 0.5 ? "var(--accent-text)" : "var(--muted)"} style={{ fontFamily: "var(--font-sans)" }}>
                    {m.when}
                  </text>
                </g>
              );
            })}
            {still &&
              hellos.map((g) => (
                <g key={g.language} transform={`translate(${g.at * spacing} ${GROUND - 150})`}>
                  <Bubble text={g.hello} opacity={1} />
                </g>
              ))}
          </g>
          <g transform={`translate(${centre} ${(GROUND + hill(x0)).toFixed(1)}) scale(${ZOOM})`}>
            <g transform={`scale(${turn.toFixed(3)} 1)`}>
              {things(from, 1 - k, true, "a")}
              {things(to, k, true, "b")}
              {from.partner && <Body pose={from.partner} d={d} turn={-1} color="var(--accent)" opacity={(1 - k) * dim} />}
              {to.partner && <Body pose={to.partner} d={d} turn={-1} color="var(--accent)" opacity={k * dim} />}
              <Body pose={pose} d={d} />
              {things(from, 1 - k, false, "c")}
              {things(to, k, false, "d")}
            </g>
            {!still &&
              hellos.map((g) => {
                const o = smooth((0.3 - Math.abs(p - g.at)) / 0.12);
                return o > 0 ? (
                  <g key={g.language} transform={`translate(${(head[0] * turn + 16).toFixed(1)} ${(head[1] - d.r - 10).toFixed(1)}) scale(${1 / ZOOM})`}>
                    <Bubble text={g.hello} opacity={o} />
                  </g>
                ) : null;
              })}
          </g>
        </svg>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-12 sm:gap-8">
        <div aria-live={playing ? "off" : "polite"} className="min-h-[9rem] sm:col-span-7">
          <p className="voice text-accent-text">{current.when}</p>
          <p className="mt-1 font-display text-2xl leading-tight tracking-[-0.01em]">{current.title}</p>
          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-snug text-muted">{current.note}</p>
        </div>
        <div className="sm:col-span-5">
          <div className="flex items-center gap-2">
            {!still && (
              <button
                type="button"
                onClick={() => {
                  if (playing) return stopPlay();
                  if (pos.current >= LAST - 0.01) set(0);
                  target.current = null;
                  auto.current = true;
                  setPlaying(true);
                }}
                className="meta h-11 shrink-0 border border-rule px-4 text-ink transition-colors hover:border-ink"
              >
                {playing ? "Pause" : "Play"}
              </button>
            )}
            <button type="button" onClick={() => hop(-1)} disabled={p <= 0} aria-label="Earlier" className="meta grid size-11 shrink-0 place-items-center border border-rule text-ink transition-colors hover:border-ink disabled:opacity-40">
              ←
            </button>
            <button type="button" onClick={() => hop(1)} disabled={p >= LAST} aria-label="Later" className="meta grid size-11 shrink-0 place-items-center border border-rule text-ink transition-colors hover:border-ink disabled:opacity-40">
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
                stopPlay();
                set(Number(e.target.value));
              }}
              onKeyDown={(e) => {
                // The window listener moves the figure; keep the native slider step from fighting it.
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.preventDefault();
              }}
              aria-label="Position on the timeline"
              aria-valuetext={`${current.title}, ${nearest + 1} of ${LAST + 1}`}
              className="h-11 min-w-0 flex-1 accent-[var(--accent)]"
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            <span className="max-sm:hidden">Press play, hold ← →, or drag.</span>
            <span className="sm:hidden">Press play, or swipe.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
