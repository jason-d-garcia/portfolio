"use client";

import { useMemo, useState } from "react";
import type { PoolIndex } from "@/lib/vgc/pool";
import { bst } from "@/lib/vgc/pool";
import type { Species } from "@/lib/vgc/types";
import { SPECIES_MIME, Sprite, TypeBadge, searchSpecies } from "./bits";

type Sort = "relevance" | "dex" | "bst" | "spe" | "atk" | "spa";
const SORTS: { id: Sort; label: string }[] = [
  { id: "relevance", label: "Best match" },
  { id: "dex", label: "Pokédex number" },
  { id: "bst", label: "Base stat total" },
  { id: "spe", label: "Speed" },
  { id: "atk", label: "Attack" },
  { id: "spa", label: "Sp. Atk" },
];

export function Sidebar({ pool, onAdd, onTeam, canAdd }: { pool: PoolIndex; onAdd: (id: string) => void; onTeam: Set<number>; canAdd: boolean }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState<Sort>("relevance");
  const [megaOnly, setMegaOnly] = useState(false);

  const list = useMemo(() => {
    let l: Species[] = searchSpecies(pool, q);
    if (type) l = l.filter((s) => s.types.includes(type) || s.megas?.some((m) => m.types.includes(type)));
    if (megaOnly) l = l.filter((s) => s.megas?.length);
    const by: Record<Sort, ((s: Species) => number) | null> = {
      relevance: null,
      dex: (s) => -s.num,
      bst: (s) => bst(s.stats),
      spe: (s) => s.stats.spe,
      atk: (s) => s.stats.atk,
      spa: (s) => s.stats.spa,
    };
    const f = by[sort];
    return f ? [...l].sort((a, b) => f(b) - f(a)) : l;
  }, [pool, q, type, sort, megaOnly]);

  return (
    <aside aria-label="Pokémon list" className="flex min-h-0 flex-col gap-2 rounded-md bg-surface p-3 lg:sticky lg:top-4 lg:max-h-[calc(100svh-2rem)]">
      <h2 className="text-lg font-medium">Pokémon</h2>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Name, type or ability"
        aria-label="Search all Pokémon"
        className="w-full rounded border border-muted/40 bg-bg px-2 py-1.5 font-sans text-sm"
      />
      <div className="flex gap-2 font-sans text-xs">
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type" className="min-w-0 flex-1 rounded border border-muted/40 bg-bg px-1 py-1">
          <option value="">All types</option>
          {pool.types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort by" className="min-w-0 flex-1 rounded border border-muted/40 bg-bg px-1 py-1">
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 font-sans text-xs text-muted">
        <input type="checkbox" checked={megaOnly} onChange={(e) => setMegaOnly(e.target.checked)} /> Can Mega Evolve
      </label>
      <p className="font-sans text-xs text-muted">
        {list.length} of {pool.species.length}. Drag one onto a slot, or press + to add it.
      </p>
      <ul className="-mx-1 max-h-[60svh] min-h-0 flex-1 overflow-auto lg:max-h-none">
        {list.map((s) => {
          const taken = onTeam.has(s.num);
          return (
            <li
              key={s.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(SPECIES_MIME, s.id);
                e.dataTransfer.effectAllowed = "copy";
              }}
              className={`group flex cursor-grab items-center gap-2 rounded px-1 py-0.5 active:cursor-grabbing hover:bg-bg ${taken ? "opacity-50" : ""}`}
            >
              <Sprite sprite={s.sprite} name={s.name} size={40} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm leading-tight">
                  {s.name}
                  {s.megas?.length ? <span className="ml-1 font-sans text-[0.6rem] text-accent-text">MEGA</span> : null}
                </span>
                <span className="flex gap-0.5">
                  {s.types.map((t) => (
                    <TypeBadge key={t} type={t} small />
                  ))}
                  <span className="ml-1 font-sans text-[0.65rem] text-muted">
                    {sort === "spe" || sort === "atk" || sort === "spa" ? `${s.stats[sort]} ${sort === "spe" ? "Spe" : sort === "atk" ? "Atk" : "SpA"}` : `BST ${bst(s.stats)}`}
                  </span>
                </span>
              </span>
              <button
                type="button"
                onClick={() => onAdd(s.id)}
                disabled={!canAdd || taken}
                aria-label={`Add ${s.name} to the team`}
                title={taken ? "Already on the team (Species Clause)" : canAdd ? "Add to the team" : "No free slot"}
                className="grid h-7 w-7 place-items-center rounded bg-bg text-lg leading-none hover:bg-accent hover:text-accent-ink disabled:opacity-30 disabled:hover:bg-bg disabled:hover:text-ink"
              >
                +
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
