// Shapes of public/vgc/pool.json (built by scripts/vgc/build-pool.js) and of a team in the builder.

export type StatId = "hp" | "atk" | "def" | "spa" | "spd" | "spe";
export type Stats = Record<StatId, number>;
export const STAT_IDS: StatId[] = ["hp", "atk", "def", "spa", "spd", "spe"];
export const STAT_LABELS: Record<StatId, string> = { hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe" };

export type Mega = { name: string; item: string; types: string[]; stats: Stats; ability: string; sprite: string };

export type Species = {
  id: string;
  name: string;
  types: string[];
  stats: Stats;
  abilities: string[];
  // Ids of every move this species can legally have in the format.
  moves: string[];
  sprite: string;
  num: number;
  weight: number;
  requiredItem?: string;
  megas?: Mega[];
};

export type Move = {
  name: string;
  type: string;
  cat: "Physical" | "Special" | "Status";
  bp: number;
  // 0 means the move never misses.
  acc: number;
  pp: number;
  pri: number;
  target: string;
  desc: string;
};

export type Item = { name: string; desc: string; mega?: string; sprite: number };
export type Ability = { name: string; desc: string };
export type Nature = { name: string; plus: StatId | null; minus: StatId | null };

export type Pool = {
  format: string;
  species: Species[];
  moves: Record<string, Move>;
  abilities: Record<string, Ability>;
  items: Record<string, Item>;
  natures: Record<string, Nature>;
  // Attacking type -> defending type -> damage multiplier.
  typeChart: Record<string, Record<string, number>>;
};

export type PokemonSet = {
  species: string; // species id
  ability: string; // display name
  item: string; // item id, "" for none
  moves: string[]; // up to 4 move ids
  nature: string; // nature id
  sp: Stats; // Stat Points: at most 32 per stat, 66 in total
};

export type Slot = { set: PokemonSet | null; locked: boolean };
export type Team = Slot[];

export const TEAM_SIZE = 6;
export const SP_PER_STAT = 32;
export const SP_TOTAL = 66;
export const LEVEL = 50;
