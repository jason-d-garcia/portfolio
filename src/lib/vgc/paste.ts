import type { PoolIndex } from "./pool";
import { toID } from "./pool";
import type { PokemonSet, Stats, Team } from "./types";
import { SP_PER_STAT, STAT_IDS, STAT_LABELS, TEAM_SIZE } from "./types";

// Showdown's team text format. Stat Points go on the "EVs:" line, as the Champions formats on Showdown expect.
export function exportSet(pool: PoolIndex, set: PokemonSet): string {
  const sp = pool.byId.get(set.species);
  if (!sp) return "";
  const lines = [set.item ? `${sp.name} @ ${pool.items[set.item]?.name ?? set.item}` : sp.name, `Ability: ${set.ability}`, "Level: 50"];
  const evs = STAT_IDS.filter((s) => set.sp[s] > 0).map((s) => `${set.sp[s]} ${STAT_LABELS[s]}`);
  if (evs.length) lines.push(`EVs: ${evs.join(" / ")}`);
  lines.push(`${pool.natures[set.nature]?.name ?? "Serious"} Nature`);
  for (const m of set.moves) if (m) lines.push(`- ${pool.moves[m]?.name ?? m}`);
  return lines.join("\n");
}

export const exportTeam = (pool: PoolIndex, team: Team) =>
  team
    .filter((s) => s.set)
    .map((s) => exportSet(pool, s.set!))
    .join("\n\n");

const LABEL_TO_STAT: Record<string, keyof Stats> = Object.fromEntries(STAT_IDS.map((s) => [STAT_LABELS[s].toLowerCase(), s]));

// Reads up to six sets. Unknown Pokémon are reported and skipped; unknown moves or items are dropped.
export function importTeam(pool: PoolIndex, text: string): { sets: PokemonSet[]; warnings: string[] } {
  const sets: PokemonSet[] = [];
  const warnings: string[] = [];
  const itemByName = new Map(Object.entries(pool.items).map(([id, it]) => [toID(it.name), id]));
  for (const block of text.replace(/\r/g, "").split(/\n\s*\n/)) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length || sets.length >= TEAM_SIZE) continue;
    const [rawHead, itemName] = lines[0].split(" @ ");
    const head = rawHead.replace(/\s*\((M|F)\)\s*$/, "");
    // "Nickname (Species)" puts the species in parentheses.
    const nick = head.match(/\(([^()]+)\)\s*$/);
    const speciesName = nick ? nick[1] : head;
    let species = pool.byId.get(toID(speciesName));
    // A pasted mega forme maps back to its base species holding the stone.
    let megaItem = "";
    if (!species)
      for (const s of pool.species) {
        const m = s.megas?.find((x) => toID(x.name) === toID(speciesName));
        if (m) {
          species = s;
          megaItem = toID(m.item);
        }
      }
    if (!species) {
      warnings.push(`Skipped "${speciesName}": not legal in Reg M-B.`);
      continue;
    }
    const set: PokemonSet = {
      species: species.id,
      ability: species.abilities[0],
      item: itemName ? itemByName.get(toID(itemName)) ?? "" : megaItem,
      moves: [],
      nature: "serious",
      sp: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    };
    if (itemName && !set.item) warnings.push(`${species.name}: dropped unknown item "${itemName.trim()}".`);
    for (const l of lines.slice(1)) {
      if (l.startsWith("Ability:")) {
        const a = l.slice(8).trim();
        const match = species.abilities.find((x) => toID(x) === toID(a));
        if (match) set.ability = match;
        else warnings.push(`${species.name}: can't have ${a}.`);
      } else if (l.startsWith("EVs:") || l.startsWith("SPs:")) {
        for (const part of l.slice(4).split("/")) {
          const [n, label] = part.trim().split(/\s+/);
          const stat = LABEL_TO_STAT[label?.toLowerCase()];
          if (stat) set.sp[stat] = Math.max(0, Number(n) || 0);
        }
      } else if (/ Nature$/.test(l)) {
        const n = toID(l.replace(/ Nature$/, ""));
        if (pool.natures[n]) set.nature = n;
      } else if (l.startsWith("-") && set.moves.length < 4) {
        const id = toID(l.slice(1).split("/")[0]);
        if (species.moves.includes(id)) set.moves.push(id);
        else warnings.push(`${species.name}: can't learn ${l.slice(1).trim()}.`);
      }
    }
    sets.push(set);
  }
  return { sets, warnings };
}

// Compact, URL-safe encoding of a team for share links.
export function encodeTeam(team: Team): string {
  const rows = team.map(({ set, locked }) =>
    set ? [set.species, set.ability, set.item, set.moves.join("."), set.nature, STAT_IDS.map((s) => set.sp[s]).join("."), locked ? 1 : 0].join("~") : "",
  );
  return btoa(unescape(encodeURIComponent(rows.join("|")))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeTeam(pool: PoolIndex, code: string): Team | null {
  try {
    const raw = decodeURIComponent(escape(atob(code.replace(/-/g, "+").replace(/_/g, "/"))));
    const rows = raw.split("|");
    if (rows.length !== TEAM_SIZE) return null;
    return rows.map((r) => {
      if (!r) return { set: null, locked: false };
      const [species, ability, item, moves, nature, sp = "", locked] = r.split("~");
      const s = pool.byId.get(species);
      if (!s) return { set: null, locked: false };
      const nums = sp.split(".").map(Number);
      // Links can be hand-edited or come from an older pool, so keep only values that are legal now.
      return {
        set: {
          species,
          ability: s.abilities.includes(ability) ? ability : s.abilities[0],
          item: item && pool.items[item] ? item : "",
          moves: (moves ? moves.split(".") : []).filter((m) => s.moves.includes(m)).slice(0, 4),
          nature: pool.natures[nature] ? nature : "serious",
          sp: Object.fromEntries(STAT_IDS.map((st, i) => [st, Math.max(0, Math.min(SP_PER_STAT, Math.floor(nums[i]) || 0))])) as Stats,
        },
        locked: locked === "1",
      };
    });
  } catch {
    return null;
  }
}
