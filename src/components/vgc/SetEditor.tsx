"use client";

import type { PoolIndex } from "@/lib/vgc/pool";
import { battleForm, calcStats, megaOf, toID } from "@/lib/vgc/pool";
import type { PokemonSet, StatId } from "@/lib/vgc/types";
import { SP_PER_STAT, SP_TOTAL, STAT_IDS, STAT_LABELS } from "@/lib/vgc/types";
import { Sprite, TypeBadge } from "./bits";

const field = "w-full rounded border border-muted/40 bg-bg px-2 py-1.5 font-sans text-sm";

export function SetEditor({ pool, set, locked, onChange, slot }: { pool: PoolIndex; set: PokemonSet; locked: boolean; slot: number; onChange: (s: PokemonSet) => void }) {
  const species = pool.byId.get(set.species);
  if (!species) return null;
  const form = battleForm(species, set);
  const nature = pool.natures[set.nature] ?? { plus: null, minus: null, name: "Serious" };
  const stats = calcStats(form.stats, set.sp, nature);
  const spUsed = STAT_IDS.reduce((a, s) => a + set.sp[s], 0);
  const learnable = species.moves.map((id) => ({ id, m: pool.moves[id] })).sort((a, b) => a.m.name.localeCompare(b.m.name));
  const ownStones = (species.megas ?? []).map((m) => toID(m.item)).filter((id) => pool.items[id]);
  const otherItems = Object.entries(pool.items)
    .filter(([id, it]) => !it.mega && !ownStones.includes(id))
    .sort((a, b) => a[1].name.localeCompare(b[1].name));

  const setSP = (s: StatId, v: number) => {
    const others = spUsed - set.sp[s];
    const value = Math.max(0, Math.min(SP_PER_STAT, SP_TOTAL - others, Math.round(v) || 0));
    onChange({ ...set, sp: { ...set.sp, [s]: value } });
  };

  return (
    <section aria-label={`Edit ${form.name}`} className="rounded-md bg-surface p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Sprite sprite={form.sprite} name={form.name} size={64} />
        <div>
          <h2 className="text-xl font-medium">
            {form.name} <span className="font-sans text-sm text-muted">slot {slot + 1}</span>
          </h2>
          <div className="flex gap-1">
            {form.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </div>
        {locked && <p className="font-sans text-xs text-muted">Locked: suggestions keep this set. You can still edit it.</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid content-start gap-3">
          <label className="grid gap-1 font-sans text-xs text-muted">
            Ability
            <select className={field} value={set.ability} onChange={(e) => onChange({ ...set, ability: e.target.value })}>
              {species.abilities.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <span>{pool.abilities[toID(set.ability)]?.desc}</span>
            {form.mega && <span className="text-accent-text">After Mega Evolution: {form.ability}. {pool.abilities[toID(form.ability)]?.desc}</span>}
          </label>
          <label className="grid gap-1 font-sans text-xs text-muted">
            Item
            <select className={field} value={set.item} onChange={(e) => onChange({ ...set, item: e.target.value })} disabled={!!species.requiredItem}>
              {!species.requiredItem && <option value="">No item</option>}
              {species.requiredItem && <option value={toID(species.requiredItem)}>{species.requiredItem}</option>}
              {ownStones.length > 0 && (
                <optgroup label="Mega Stone">
                  {ownStones.map((id) => (
                    <option key={id} value={id}>
                      {pool.items[id].name} → {megaOf(species, id)?.name}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Items">
                {otherItems.map(([id, it]) => (
                  <option key={id} value={id}>
                    {it.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <span>{set.item && pool.items[set.item]?.desc}</span>
          </label>
          <label className="grid gap-1 font-sans text-xs text-muted">
            Nature
            <select className={field} value={set.nature} onChange={(e) => onChange({ ...set, nature: e.target.value })}>
              {Object.entries(pool.natures).map(([id, n]) => (
                <option key={id} value={id}>
                  {n.name}
                  {n.plus ? ` (+${STAT_LABELS[n.plus]} −${STAT_LABELS[n.minus!]})` : ""}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="grid gap-2">
            <legend className="mb-1 font-sans text-xs text-muted">Moves</legend>
            {[0, 1, 2, 3].map((i) => {
              const cur = set.moves[i] ?? "";
              const m = cur ? pool.moves[cur] : null;
              return (
                <div key={i} className="grid gap-0.5">
                  <select
                    aria-label={`Move ${i + 1}`}
                    className={field}
                    value={cur}
                    onChange={(e) => {
                      const moves = [...set.moves];
                      moves[i] = e.target.value;
                      onChange({ ...set, moves: moves.filter((x, j) => x || j < i).slice(0, 4) });
                    }}
                  >
                    <option value="">(none)</option>
                    {learnable.map(({ id, m }) => (
                      <option key={id} value={id} disabled={id !== cur && set.moves.includes(id)}>
                        {m.name} · {m.type} {m.cat === "Status" ? "status" : `${m.bp || "—"} ${m.cat === "Physical" ? "phys" : "spec"}`}
                      </option>
                    ))}
                  </select>
                  {m && (
                    <span className="flex flex-wrap items-center gap-1 font-sans text-[0.7rem] text-muted">
                      <TypeBadge type={m.type} small />
                      {m.cat}
                      {m.bp ? ` · ${m.bp} BP` : ""} · {m.acc ? `${m.acc}%` : "never misses"}
                      {m.pri ? ` · priority ${m.pri > 0 ? "+" : ""}${m.pri}` : ""} · {m.desc}
                    </span>
                  )}
                </div>
              );
            })}
          </fieldset>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between font-sans text-xs text-muted">
            <span>Stat Points (max {SP_PER_STAT} each)</span>
            <span className={spUsed > SP_TOTAL ? "text-field-1" : ""}>
              {spUsed} / {SP_TOTAL} used
            </span>
          </div>
          <table className="w-full font-sans text-sm">
            <thead className="sr-only">
              <tr>
                <th>Stat</th>
                <th>Base</th>
                <th>Stat Points</th>
                <th>Level 50 stat</th>
              </tr>
            </thead>
            <tbody>
              {STAT_IDS.map((s) => {
                const tag = nature.plus === s ? "+" : nature.minus === s ? "−" : "";
                return (
                  <tr key={s}>
                    <th scope="row" className={`w-12 text-left font-normal ${tag === "+" ? "text-field-1" : tag === "−" ? "text-field-2" : ""}`}>
                      {STAT_LABELS[s]}
                      {tag}
                    </th>
                    <td className="w-10 text-right text-muted">{form.stats[s]}</td>
                    <td className="px-2">
                      <input
                        type="range"
                        min={0}
                        max={SP_PER_STAT}
                        value={set.sp[s]}
                        onChange={(e) => setSP(s, Number(e.target.value))}
                        aria-label={`${STAT_LABELS[s]} Stat Points`}
                        className="w-full accent-[var(--accent)]"
                      />
                    </td>
                    <td className="w-12">
                      <input
                        type="number"
                        min={0}
                        max={SP_PER_STAT}
                        value={set.sp[s]}
                        onChange={(e) => setSP(s, Number(e.target.value))}
                        aria-label={`${STAT_LABELS[s]} Stat Points value`}
                        className="w-12 rounded border border-muted/40 bg-bg px-1 text-right"
                      />
                    </td>
                    <td className="w-12 text-right font-medium tabular-nums">{stats[s]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 font-sans text-xs text-muted">Level 50, all IVs 31. Each Stat Point adds about one point to the stat.</p>
        </div>
      </div>
    </section>
  );
}
