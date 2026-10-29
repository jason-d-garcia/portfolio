"use client";

import { useState } from "react";
import type { PoolIndex } from "@/lib/vgc/pool";
import { TYPE_COLORS, spriteUrl } from "@/lib/vgc/pool";
import type { Species } from "@/lib/vgc/types";

export function TypeBadge({ type, small }: { type: string; small?: boolean }) {
  return (
    <span
      className={`inline-block rounded-sm font-sans uppercase tracking-wide text-white ${small ? "px-1 text-[0.6rem] leading-4" : "px-1.5 text-[0.7rem] leading-5"}`}
      style={{ background: TYPE_COLORS[type] ?? "#777" }}
    >
      {type}
    </span>
  );
}

export function Sprite({ sprite, name, size = 64 }: { sprite: string; name: string; size?: number }) {
  const [failed, setFailed] = useState<string | null>(null);
  if (failed === sprite)
    return (
      <span aria-hidden className="grid shrink-0 place-items-center rounded-full bg-bg text-muted" style={{ width: size, height: size, fontSize: size / 3 }}>
        {name.slice(0, 2)}
      </span>
    );
  return (
    // Sprites come from Showdown's CDN; next/image would proxy hundreds of tiny files for no gain.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={spriteUrl(sprite)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(sprite)}
      className="shrink-0 [image-rendering:pixelated]"
      style={{ width: size, height: size }}
    />
  );
}

// Name prefix first, then substring, then type or ability matches ("fire", "intimidate").
export function searchSpecies(pool: PoolIndex, query: string): Species[] {
  const q = query.trim().toLowerCase();
  if (!q) return pool.species;
  const starts: Species[] = [];
  const contains: Species[] = [];
  const other: Species[] = [];
  for (const s of pool.species) {
    const n = s.name.toLowerCase();
    if (n.startsWith(q)) starts.push(s);
    else if (n.includes(q)) contains.push(s);
    else if (s.types.some((t) => t.toLowerCase() === q) || s.abilities.some((a) => a.toLowerCase().includes(q)) || s.megas?.some((m) => m.name.toLowerCase().includes(q)))
      other.push(s);
  }
  return [...starts, ...contains, ...other];
}

export const SPECIES_MIME = "application/x-vgc-species";
export const SLOT_MIME = "application/x-vgc-slot";
