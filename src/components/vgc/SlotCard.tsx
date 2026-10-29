"use client";

import { useId, useMemo, useState } from "react";
import type { PoolIndex } from "@/lib/vgc/pool";
import { battleForm } from "@/lib/vgc/pool";
import type { Slot } from "@/lib/vgc/types";
import { SLOT_MIME, SPECIES_MIME, Sprite, TypeBadge, searchSpecies } from "./bits";

type Props = {
  pool: PoolIndex;
  index: number;
  slot: Slot;
  selected: boolean;
  hasProblem: boolean;
  onSelect: () => void;
  // Focusing an empty slot makes it the target of the list's + buttons.
  onTarget: () => void;
  onPut: (speciesId: string) => void;
  onSwap: (from: number) => void;
  onClear: () => void;
  onToggleLock: () => void;
};

export function SlotCard({ pool, index, slot, selected, hasProblem, onSelect, onTarget, onPut, onSwap, onClear, onToggleLock }: Props) {
  const [over, setOver] = useState(false);
  const [searching, setSearching] = useState(false);
  const set = slot.set;
  const species = set ? pool.byId.get(set.species) : undefined;
  const form = species && set ? battleForm(species, set) : null;

  const accepts = (e: React.DragEvent) => !slot.locked && (e.dataTransfer.types.includes(SPECIES_MIME) || e.dataTransfer.types.includes(SLOT_MIME));

  return (
    <div
      role="group"
      aria-label={`Slot ${index + 1}${form ? `: ${form.name}` : ", empty"}${slot.locked ? ", locked" : ""}`}
      onDragOver={(e) => {
        if (!accepts(e)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = e.dataTransfer.types.includes(SLOT_MIME) ? "move" : "copy";
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onFocusCapture={() => !set && onTarget()}
      onDrop={(e) => {
        setOver(false);
        if (slot.locked) return;
        e.preventDefault();
        const from = e.dataTransfer.getData(SLOT_MIME);
        if (from !== "") return onSwap(Number(from));
        const id = e.dataTransfer.getData(SPECIES_MIME);
        if (id) onPut(id);
      }}
      className={`relative flex min-h-44 flex-col rounded-md border-2 bg-surface p-2 transition-colors sm:min-h-52 sm:p-3 ${
        over ? "border-accent bg-bg" : selected ? "border-ink" : slot.locked ? "border-field-4" : "border-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-1 font-sans text-xs text-muted">
        <span>
          {index + 1}
          {hasProblem && (
            <span className="ml-1 text-field-1" title="This slot has a problem; see the checks below.">
              ●
            </span>
          )}
        </span>
        <span className="flex gap-1">
          <button
            type="button"
            onClick={onToggleLock}
            disabled={!set}
            aria-pressed={slot.locked}
            title={slot.locked ? "Unlock: suggestions may replace this Pokémon" : "Lock: keep this Pokémon when suggesting"}
            className={`rounded px-1.5 py-0.5 disabled:opacity-30 ${slot.locked ? "bg-field-4 text-field-4-ink" : "hover:bg-bg"}`}
          >
            {slot.locked ? "🔒 Locked" : "🔓 Lock"}
          </button>
          {set && !slot.locked && (
            <button type="button" onClick={onClear} title="Remove from team" aria-label={`Remove ${form?.name}`} className="rounded px-1.5 py-0.5 hover:bg-bg">
              ✕
            </button>
          )}
        </span>
      </div>

      {form && species && set && !searching ? (
        <button
          type="button"
          draggable={!slot.locked}
          onDragStart={(e) => {
            e.dataTransfer.setData(SLOT_MIME, String(index));
            e.dataTransfer.effectAllowed = "move";
          }}
          onClick={onSelect}
          className="flex flex-1 flex-col items-center gap-1 text-center"
          title="Edit this Pokémon's set"
        >
          <Sprite sprite={form.sprite} name={form.name} size={72} />
          <span className="text-sm leading-tight font-medium sm:text-base">{form.name}</span>
          <span className="flex flex-wrap justify-center gap-1">
            {form.types.map((t) => (
              <TypeBadge key={t} type={t} small />
            ))}
          </span>
          <span className="hidden font-sans text-xs text-muted sm:block">
            {set.item ? pool.items[set.item]?.name : "No item"} · {form.mega ? form.ability : set.ability}
          </span>
          <span className="hidden font-sans text-[0.7rem] leading-snug text-muted md:block">
            {set.moves.map((m) => pool.moves[m]?.name).filter(Boolean).join(" · ")}
          </span>
        </button>
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-2">
          <SlotSearch pool={pool} autoFocus={searching} onPick={(id) => {
              onPut(id);
              setSearching(false);
            }} onCancel={searching ? () => setSearching(false) : undefined} />
          {!searching && <p className="text-center font-sans text-xs text-muted">Search here, or drag one in from the list.</p>}
        </div>
      )}

      {set && !slot.locked && !searching && (
        <button type="button" onClick={() => setSearching(true)} className="mt-1 self-center font-sans text-xs text-muted underline-offset-2 hover:text-ink hover:underline">
          Replace
        </button>
      )}
    </div>
  );
}

function SlotSearch({ pool, onPick, autoFocus, onCancel }: { pool: PoolIndex; onPick: (id: string) => void; autoFocus?: boolean; onCancel?: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const results = useMemo(() => (q.trim() ? searchSpecies(pool, q).slice(0, 8) : []), [pool, q]);

  return (
    <div className="relative">
      <input
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            onPick(results[active].id);
            setQ("");
          } else if (e.key === "Escape") {
            setQ("");
            onCancel?.();
          }
        }}
        onBlur={() => onCancel && !q && onCancel()}
        placeholder="Search"
        aria-label="Search Pokémon for this slot"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls={listId}
        aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
        className="w-full rounded border border-muted/40 bg-bg px-2 py-1.5 font-sans text-sm"
      />
      {results.length > 0 && (
        <ul id={listId} role="listbox" className="absolute top-full right-0 left-0 z-20 mt-1 max-h-72 overflow-auto rounded border border-muted/30 bg-bg shadow-lg">
          {results.map((s, i) => (
            <li
              key={s.id}
              id={`${listId}-${s.id}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(s.id);
                setQ("");
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-2 px-2 py-1 font-sans text-sm ${i === active ? "bg-surface" : ""}`}
            >
              <Sprite sprite={s.sprite} name={s.name} size={32} />
              <span className="flex-1 truncate">{s.name}</span>
              <span className="hidden gap-0.5 lg:flex">
                {s.types.map((t) => (
                  <TypeBadge key={t} type={t} small />
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
