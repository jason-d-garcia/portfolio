import type { PoolIndex } from "./pool";
import { battleForm, megaOf, toID } from "./pool";
import type { Move, PokemonSet, Species, Stats, Team } from "./types";
import { SP_PER_STAT, SP_TOTAL, STAT_IDS, STAT_LABELS } from "./types";

// Abilities worth picking over a species' first listed ability when it has them.
const GOOD_ABILITIES = [
  "Intimidate", "Prankster", "Drizzle", "Drought", "Sand Stream", "Snow Warning", "Psychic Surge", "Grassy Surge",
  "Electric Surge", "Misty Surge", "Friend Guard", "Regenerator", "Unaware", "Good as Gold", "Armor Tail",
  "Huge Power", "Adaptability", "Technician", "Swift Swim", "Chlorophyll", "Sand Rush", "Slush Rush", "Inner Focus",
  "Multiscale", "Levitate", "Flash Fire", "Storm Drain", "Lightning Rod", "Thick Fat", "Sheer Force", "Tough Claws",
];

const ITEM_PREFERENCE = [
  "sitrusberry", "focussash", "lifeorb", "choicescarf", "assaultvest", "leftovers", "choicespecs", "choiceband",
  "expertbelt", "safetygoggles", "covertcloak", "mysticwater", "charcoal", "magnet", "miracleseed", "lumberry",
  "blackglasses", "shellbell", "brightpowder", "quickclaw", "kingsrock", "scopelens",
];

// Moves the auto-picker skips: they cost a turn, faint the user, or only work in rare setups.
const AWKWARD = new Set([
  "hyperbeam", "gigaimpact", "solarbeam", "solarblade", "focuspunch", "explosion", "selfdestruct", "mistyexplosion",
  "skyattack", "meteorbeam", "futuresight", "dreameater", "belch", "lastresort", "steelbeam", "mindblown", "skullbash",
  "razorwind", "synchronoise", "fling", "naturalgift", "round", "echoedvoice", "snore", "frustration", "return",
  "dig", "dive", "fly", "bounce", "phantomforce", "shadowforce", "freezeshock", "iceburn", "bide", "counter",
  "mirrorcoat", "metalburst", "endeavor", "finalgambit", "uproar", "thrash", "petaldance", "outrage", "ragingfury",
]);

const SUPPORT_MOVES = ["fakeout", "followme", "ragepowder", "tailwind", "trickroom", "helpinghand", "icywind", "electroweb", "spore", "willowisp", "thunderwave", "snarl", "partingshot", "wideguard"];

const emptySP = (): Stats => ({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });

function moveScore(m: Move, stab: boolean) {
  const acc = m.acc === 0 ? 100 : m.acc;
  const spread = m.target === "allAdjacentFoes" || m.target === "allAdjacent" ? 0.85 * 1.25 : 1;
  return m.bp * (acc / 100) * (stab ? 1.5 : 1) * spread;
}

// A reasonable default set, so any Pokémon added to the team can be exported and played straight away.
export function autoSet(pool: PoolIndex, species: Species, takenItems: Set<string> = new Set(), allowMega = true): PokemonSet {
  const ability = GOOD_ABILITIES.find((a) => species.abilities.includes(a)) ?? species.abilities[0];

  let item = species.requiredItem ? toID(species.requiredItem) : "";
  if (!item && allowMega && species.megas?.length) {
    const stone = toID(species.megas[0].item);
    if (!takenItems.has(stone) && pool.items[stone]) item = stone;
  }
  const form = battleForm(species, { species: species.id, ability, item, moves: [], nature: "serious", sp: emptySP() });
  const physical = form.stats.atk >= form.stats.spa;
  const fast = form.stats.spe >= 85;

  const learn = new Set(species.moves);
  const picked: string[] = [];
  if (learn.has("protect")) picked.push("protect");
  const support = SUPPORT_MOVES.find((m) => learn.has(m));
  if (support) picked.push(support);

  const attacks = species.moves
    .map((id) => ({ id, m: pool.moves[id] }))
    .filter(({ id, m }) => m && m.cat === (physical ? "Physical" : "Special") && m.bp > 0 && !AWKWARD.has(id));
  const byScore = (stabOnly: boolean) =>
    attacks
      .filter(({ m }) => !stabOnly || form.types.includes(m.type))
      .sort((a, b) => moveScore(b.m, form.types.includes(b.m.type)) - moveScore(a.m, form.types.includes(a.m.type)));
  const usedTypes = new Set<string>();
  for (const { id, m } of [...byScore(true), ...byScore(false)]) {
    if (picked.length >= 4) break;
    if (picked.includes(id) || usedTypes.has(m.type)) continue;
    picked.push(id);
    usedTypes.add(m.type);
  }
  for (const id of species.moves) {
    if (picked.length >= 4) break;
    if (!picked.includes(id) && !AWKWARD.has(id)) picked.push(id);
  }

  if (!item) item = ITEM_PREFERENCE.find((i) => pool.items[i] && !takenItems.has(i)) ?? "";

  const sp = emptySP();
  const main = physical ? "atk" : "spa";
  sp[main] = SP_PER_STAT;
  if (fast) {
    sp.spe = SP_PER_STAT;
    sp.hp = SP_TOTAL - 2 * SP_PER_STAT;
  } else {
    sp.hp = SP_PER_STAT;
    sp.spd = SP_TOTAL - 2 * SP_PER_STAT;
  }
  const nature = physical ? (fast ? "jolly" : "adamant") : fast ? "timid" : "modest";
  return { species: species.id, ability, item, moves: picked.slice(0, 4), nature, sp };
}

export type Problem = { slot: number | null; text: string };

// Mirrors the Reg M-B checks a player is most likely to trip over. Showdown's validator remains the authority.
export function validateTeam(pool: PoolIndex, team: Team): Problem[] {
  const out: Problem[] = [];
  const seenNum = new Map<number, number>();
  const seenItem = new Map<string, number>();
  team.forEach(({ set }, i) => {
    if (!set) return;
    const sp = pool.byId.get(set.species);
    if (!sp) return out.push({ slot: i, text: `Slot ${i + 1}: unknown Pokémon.` });
    const label = `${sp.name} (slot ${i + 1})`;
    const prev = seenNum.get(sp.num);
    if (prev !== undefined) out.push({ slot: i, text: `Species Clause: ${label} is the same species as slot ${prev + 1}.` });
    else seenNum.set(sp.num, i);
    if (set.item) {
      const p = seenItem.get(set.item);
      if (p !== undefined) out.push({ slot: i, text: `Item Clause: ${label} holds the same item as slot ${p + 1}.` });
      else seenItem.set(set.item, i);
      const it = pool.items[set.item];
      if (it?.mega && !megaOf(sp, set.item)) out.push({ slot: i, text: `${label} can't use ${it.name}.` });
    }
    if (sp.requiredItem && set.item !== toID(sp.requiredItem)) out.push({ slot: i, text: `${label} must hold ${sp.requiredItem}.` });
    if (!sp.abilities.includes(set.ability)) out.push({ slot: i, text: `${label} can't have ${set.ability}.` });
    const moves = set.moves.filter(Boolean);
    if (!moves.length) out.push({ slot: i, text: `${label} has no moves.` });
    if (new Set(moves).size !== moves.length) out.push({ slot: i, text: `${label} has the same move twice.` });
    for (const m of moves) if (!sp.moves.includes(m)) out.push({ slot: i, text: `${label} can't learn ${pool.moves[m]?.name ?? m}.` });
    const total = STAT_IDS.reduce((a, s) => a + set.sp[s], 0);
    if (total > SP_TOTAL) out.push({ slot: i, text: `${label} has ${total} Stat Points; the limit is ${SP_TOTAL}.` });
    for (const s of STAT_IDS)
      if (set.sp[s] > SP_PER_STAT) out.push({ slot: i, text: `${label} has more than ${SP_PER_STAT} Stat Points in ${STAT_LABELS[s]}.` });
  });
  return out;
}
