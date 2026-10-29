"use client";

import type { PoolIndex } from "@/lib/vgc/pool";
import { TYPE_COLORS, battleForm, calcStats, defensiveMultiplier, effectiveness, inkOn } from "@/lib/vgc/pool";
import type { Problem } from "@/lib/vgc/sets";
import type { Team } from "@/lib/vgc/types";
import { Sprite, TypeBadge } from "./bits";

const fmt = (m: number) => (m === 0 ? "0" : m === 0.25 ? "¼" : m === 0.5 ? "½" : m === 1 ? "" : m === 2 ? "2" : m === 4 ? "4" : String(m));
const cellColor = (m: number) =>
  m === 0 ? "bg-field-2 text-white" : m < 1 ? "bg-field-3/70 text-white" : m >= 4 ? "bg-field-1 text-white" : m > 1 ? "bg-field-1/60 text-white" : "";

export function Analysis({ pool, team, problems }: { pool: PoolIndex; team: Team; problems: Problem[] }) {
  const members = team.flatMap((s, i) => {
    if (!s.set) return [];
    const sp = pool.byId.get(s.set.species);
    if (!sp) return [];
    const form = battleForm(sp, s.set);
    const nature = pool.natures[s.set.nature] ?? { plus: null, minus: null };
    return [{ i, set: s.set, form, stats: calcStats(form.stats, s.set.sp, nature) }];
  });

  if (!members.length)
    return <p className="rounded-md bg-surface p-4 font-sans text-sm text-muted">Add Pokémon to see type matchups, coverage and speed.</p>;

  // Best multiplier the team's damaging moves get against a single-type target of each type.
  const coverage = pool.types.map((def) => {
    let best = 0;
    let by = "";
    for (const m of members)
      for (const id of m.set.moves) {
        const mv = pool.moves[id];
        if (!mv || mv.cat === "Status" || !mv.bp) continue;
        const e = effectiveness(pool, mv.type, [def]);
        if (e > best) {
          best = e;
          by = `${mv.name} (${m.form.name})`;
        }
      }
    return { def, best, by };
  });
  const speed = [...members].sort((a, b) => b.stats.spe - a.stats.spe);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section className="rounded-md bg-surface p-4" aria-labelledby="def-h">
        <h2 id="def-h" className="mb-1 text-lg font-medium">
          Defensive matchups
        </h2>
        <p className="mb-3 font-sans text-xs text-muted">Damage each member takes from each attacking type, after Mega Evolution and type-changing abilities. Highlighted rows: three or more weak and none resist.</p>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0.5 font-sans text-xs">
            <thead>
              <tr>
                <th className="text-left font-normal text-muted">Attack</th>
                {members.map((m) => (
                  <th key={m.i} title={m.form.name} className="font-normal">
                    <span className="flex justify-center">
                      <Sprite sprite={m.form.sprite} name={m.form.name} size={32} />
                    </span>
                    <span className="sr-only">{m.form.name}</span>
                  </th>
                ))}
                <th className="font-normal text-muted" title="Members weak to this type">
                  Weak
                </th>
                <th className="font-normal text-muted" title="Members that resist or are immune">
                  Resist
                </th>
              </tr>
            </thead>
            <tbody>
              {pool.types.map((t) => {
                const mults = members.map((m) => defensiveMultiplier(pool, t, m.form.types, m.form.ability));
                const weak = mults.filter((x) => x > 1).length;
                const resist = mults.filter((x) => x < 1).length;
                const danger = weak >= 3 && resist === 0;
                return (
                  <tr key={t}>
                    <th scope="row" className={`rounded-sm text-left font-normal ${danger ? "bg-field-1/25" : ""}`}>
                      <TypeBadge type={t} small />
                    </th>
                    {mults.map((x, j) => (
                      <td key={j} className={`h-6 min-w-7 rounded-sm text-center tabular-nums ${cellColor(x)}`}>
                        {fmt(x)}
                      </td>
                    ))}
                    <td className={`text-center tabular-nums ${weak >= 3 ? "font-bold text-field-1" : ""}`}>{weak || ""}</td>
                    <td className="text-center tabular-nums">{resist || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid content-start gap-4">
        <section className="rounded-md bg-surface p-4" aria-labelledby="chk-h">
          <h2 id="chk-h" className="mb-2 text-lg font-medium">
            Team checks
          </h2>
          {problems.length ? (
            <ul className="grid gap-1 font-sans text-sm text-field-1">
              {problems.map((p, i) => (
                <li key={i}>● {p.text}</li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-sm text-accent-text">No rule problems found (Species Clause, Item Clause, moves, abilities, Stat Points).</p>
          )}
        </section>

        <section className="rounded-md bg-surface p-4" aria-labelledby="cov-h">
          <h2 id="cov-h" className="mb-1 text-lg font-medium">
            Offensive coverage
          </h2>
          <p className="mb-2 font-sans text-xs text-muted">Best hit from the team&apos;s attacking moves against each type.</p>
          <ul className="flex flex-wrap gap-1 font-sans text-xs">
            {coverage.map((c) => (
              <li
                key={c.def}
                title={c.by ? `${fmt(c.best) || "1"}× with ${c.by}` : "No attacking move hits this type"}
                className="flex items-center gap-1 rounded-sm px-1.5 py-0.5"
                style={{ background: c.best > 1 ? TYPE_COLORS[c.def] : "transparent", color: c.best > 1 ? inkOn(TYPE_COLORS[c.def]) : undefined, outline: c.best > 1 ? undefined : "1px dashed var(--muted)" }}
              >
                {c.def}
                <span className="tabular-nums">{c.best > 1 ? `${c.best}×` : c.best === 0 ? "—" : c.best < 1 ? "½" : "1×"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 font-sans text-xs text-muted">
            No super-effective hit on: {coverage.filter((c) => c.best <= 1).map((c) => c.def).join(", ") || "none"}.
          </p>
        </section>

        <section className="rounded-md bg-surface p-4" aria-labelledby="spe-h">
          <h2 id="spe-h" className="mb-2 text-lg font-medium">
            Speed order
          </h2>
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="text-left font-normal">Pokémon</th>
                <th className="text-right font-normal">Speed</th>
                <th className="text-right font-normal" title="Speed doubled by Tailwind">
                  Tailwind
                </th>
              </tr>
            </thead>
            <tbody>
              {speed.map((m) => (
                <tr key={m.i}>
                  <td>{m.form.name}</td>
                  <td className="text-right tabular-nums">{m.stats.spe}</td>
                  <td className="text-right text-muted tabular-nums">{m.stats.spe * 2}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 font-sans text-xs text-muted">Under Trick Room the slowest moves first: read this list bottom up.</p>
        </section>
      </div>
    </div>
  );
}
