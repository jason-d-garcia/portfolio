import type { Mega, PokemonSet, Pool, Species, Stats } from "./types";
import { LEVEL, STAT_IDS } from "./types";

export const toID = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export type PoolIndex = Pool & { byId: Map<string, Species>; types: string[] };

let cached: Promise<PoolIndex> | null = null;

export function loadPool(): Promise<PoolIndex> {
  cached ??= fetch("/vgc/pool.json")
    .then((r) => {
      if (!r.ok) throw new Error(`Could not load the Pokémon data (${r.status}).`);
      return r.json() as Promise<Pool>;
    })
    .then((p) => ({ ...p, byId: new Map(p.species.map((s) => [s.id, s])), types: Object.keys(p.typeChart) }))
    .catch((e) => {
      cached = null;
      throw e;
    });
  return cached;
}

export const spriteUrl = (sprite: string) => `https://play.pokemonshowdown.com/sprites/gen5/${sprite}.png`;

// The mega forme a set turns into, when its item is that species' mega stone.
export function megaOf(species: Species, item: string): Mega | undefined {
  return species.megas?.find((m) => toID(m.item) === item);
}

// Types, base stats and ability the set battles with after Mega Evolution, if any.
export function battleForm(species: Species, set: PokemonSet) {
  const mega = megaOf(species, set.item);
  return mega
    ? { name: mega.name, types: mega.types, stats: mega.stats, ability: mega.ability, sprite: mega.sprite, mega: true }
    : { name: species.name, types: species.types, stats: species.stats, ability: set.ability, sprite: species.sprite, mega: false };
}

// Champions stat formula at level 50 with all IVs at 31 (see Showdown's champions mod, statModify).
export function calcStats(base: Stats, sp: Stats, nature: { plus: string | null; minus: string | null }): Stats {
  const out = {} as Stats;
  for (const s of STAT_IDS) {
    if (s === "hp") {
      out.hp = Math.floor(((2 * base.hp + 31 + Math.max(2 * sp.hp - 1, 0)) * LEVEL) / 100) + LEVEL + 10;
      continue;
    }
    let v = Math.floor(((2 * base[s] + 31 + Math.max(2 * sp[s] - 1, 0)) * LEVEL) / 100) + 5;
    if (nature.plus === s) v = Math.floor((v * 110) / 100);
    else if (nature.minus === s) v = Math.floor((v * 90) / 100);
    out[s] = v;
  }
  return out;
}

export const bst = (s: Stats) => STAT_IDS.reduce((a, k) => a + s[k], 0);

// Multiplier for an attacking type against a defender's types.
export function effectiveness(pool: Pool, atk: string, defTypes: string[]) {
  return defTypes.reduce((m, d) => m * (pool.typeChart[atk]?.[d] ?? 1), 1);
}

// Abilities that change what hits a Pokémon, applied on top of the type chart.
const ABILITY_IMMUNE: Record<string, string> = {
  levitate: "Ground",
  flashfire: "Fire",
  waterabsorb: "Water",
  stormdrain: "Water",
  dryskin: "Water",
  voltabsorb: "Electric",
  lightningrod: "Electric",
  motordrive: "Electric",
  sapsipper: "Grass",
  eartheater: "Ground",
  wellbakedbody: "Fire",
};

export function defensiveMultiplier(pool: Pool, atk: string, types: string[], ability: string) {
  const a = toID(ability);
  if (ABILITY_IMMUNE[a] === atk) return 0;
  let m = effectiveness(pool, atk, types);
  if (a === "thickfat" && (atk === "Fire" || atk === "Ice")) m /= 2;
  if (a === "heatproof" && atk === "Fire") m /= 2;
  if (a === "purifyingsalt" && atk === "Ghost") m /= 2;
  if (a === "waterbubble" && atk === "Fire") m /= 2;
  if (a === "fluffy" && atk === "Fire") m *= 2;
  if (a === "dryskin" && atk === "Fire") m *= 1.25;
  return m;
}

export const TYPE_COLORS: Record<string, string> = {
  Normal: "#9a9a72",
  Fire: "#e0662b",
  Water: "#4c7be0",
  Electric: "#e8be20",
  Grass: "#5fae3c",
  Ice: "#6cc8c8",
  Fighting: "#b5302a",
  Poison: "#9440a0",
  Ground: "#cfa850",
  Flying: "#9480e6",
  Psychic: "#ee4c7c",
  Bug: "#9aaa1f",
  Rock: "#b09a36",
  Ghost: "#6a5492",
  Dragon: "#6a3cf0",
  Dark: "#6a5446",
  Steel: "#9a9ab8",
  Fairy: "#e07ca8",
};
