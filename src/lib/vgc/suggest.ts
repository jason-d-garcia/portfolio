// Fills the unlocked slots of a team. The GA (MAP-Elites over the Rust engine) plugs in here as another
// TeamSuggester; RemoteSuggester already speaks the HTTP contract it will need.
import type { PoolIndex } from "./pool";
import { battleForm, bst, defensiveMultiplier } from "./pool";
import { autoSet } from "./sets";
import type { PokemonSet, Species, Team } from "./types";

export type SuggestRequest = {
  team: Team; // locked slots must come back unchanged
  format: string;
  seed?: number;
  // How many alternative teams to return, e.g. one per MAP-Elites niche.
  count?: number;
};

export type Suggestion = {
  team: Team;
  // Higher is better. Units depend on the suggester (heuristic points, or usage-weighted win rate for the GA).
  score: number;
  // One line per filled slot or per design choice, shown to the player.
  rationale: string[];
};

export interface TeamSuggester {
  readonly id: string;
  readonly label: string;
  suggest(req: SuggestRequest, pool: PoolIndex, signal?: AbortSignal): Promise<Suggestion[]>;
}

// Small deterministic PRNG so a seed reproduces the same suggestion.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formOf(pool: PoolIndex, set: PokemonSet) {
  return battleForm(pool.byId.get(set.species)!, set);
}

// Weakness profile: for each attacking type, how many members are hit super effectively minus how many resist.
function weaknessBalance(pool: PoolIndex, sets: PokemonSet[]) {
  const bal: Record<string, number> = {};
  for (const t of pool.types) {
    bal[t] = 0;
    for (const s of sets) {
      const f = formOf(pool, s);
      const m = defensiveMultiplier(pool, t, f.types, f.ability);
      if (m > 1) bal[t] += 1;
      else if (m < 1) bal[t] -= 1;
    }
  }
  return bal;
}

// Placeholder until the GA is connected: greedy picks that patch the team's shared weaknesses, favour
// strong base stats, and add some randomness so repeated clicks give different teams.
export const heuristicSuggester: TeamSuggester = {
  id: "heuristic",
  label: "Quick heuristic (placeholder for the GA)",
  async suggest({ team, seed = Date.now(), count = 1 }, pool) {
    const out: Suggestion[] = [];
    for (let k = 0; k < count; k++) {
      const rand = mulberry32(seed + k * 7919);
      const next: Team = team.map((s) => ({ ...s, set: s.locked ? s.set : null }));
      const rationale: string[] = [];
      let score = 0;
      for (let i = 0; i < next.length; i++) {
        if (next[i].locked && next[i].set) continue;
        const sets = next.flatMap((s) => (s.set ? [s.set] : []));
        const usedNums = new Set(sets.map((s) => pool.byId.get(s.species)!.num));
        const items = new Set(sets.map((s) => s.item).filter(Boolean));
        const hasMega = sets.some((s) => formOf(pool, s).mega);
        const bal = weaknessBalance(pool, sets);
        let best: { sp: Species; set: PokemonSet; v: number; why: string } | null = null;
        for (const sp of pool.species) {
          if (usedNums.has(sp.num)) continue;
          const set = autoSet(pool, sp, items, !hasMega);
          const f = battleForm(sp, set);
          let v = bst(f.stats) / 60;
          let patched = "";
          let worst = 0;
          for (const t of pool.types) {
            const m = defensiveMultiplier(pool, t, f.types, f.ability);
            if (bal[t] > 0 && m < 1) {
              v += bal[t] * (m === 0 ? 1.5 : 1);
              if (!patched || bal[t] > worst) {
                patched = t;
                worst = bal[t];
              }
            }
            if (bal[t] > 0 && m > 1) v -= bal[t] * 1.5;
          }
          v += rand() * 4;
          if (!best || v > best.v) best = { sp, set, v, why: patched ? `covers the team's ${patched} weakness` : "strong base stats" };
        }
        if (!best) break;
        next[i] = { set: best.set, locked: false };
        score += best.v;
        rationale.push(`Slot ${i + 1}: ${battleForm(best.sp, best.set).name}, ${best.why}.`);
      }
      out.push({ team: next, score: Math.round(score * 10) / 10, rationale });
    }
    return out;
  },
};

// Talks to a search service, e.g. the Python/Rust GA behind an HTTP endpoint.
// POST { format, team, seed, count } -> { suggestions: Suggestion[] }
export function remoteSuggester(url: string): TeamSuggester {
  return {
    id: "remote",
    label: "Team search service",
    async suggest(req, _pool, signal) {
      const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(req), signal });
      if (!r.ok) throw new Error(`The team search service answered ${r.status}.`);
      const body = (await r.json()) as { suggestions: Suggestion[] };
      // Never let the service change a locked slot.
      return body.suggestions.map((s) => ({
        ...s,
        team: req.team.map((mine, i) => (mine.locked ? mine : { set: s.team?.[i]?.set ?? null, locked: false })),
      }));
    },
  };
}

// Set NEXT_PUBLIC_VGC_SUGGEST_URL at build time to switch the builder to the GA service.
export const suggesters: TeamSuggester[] = process.env.NEXT_PUBLIC_VGC_SUGGEST_URL
  ? [remoteSuggester(process.env.NEXT_PUBLIC_VGC_SUGGEST_URL), heuristicSuggester]
  : [heuristicSuggester];
