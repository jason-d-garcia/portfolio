// Builds the Reg M-B legal pool JSON for the team builder from Showdown's champions mod.
// Run: npm i --no-save pokemon-showdown@0.11.11 && node scripts/vgc/build-pool.js public/vgc/pool.json
const fs = require('fs');
const {TeamValidator} = require('pokemon-showdown');
const v = TeamValidator.get('gen9championsvgc2026regmb'); const dex = v.dex;
const out = {format: v.format.name, species: [], moves: {}, abilities: {}, items: {}, natures: {}};
const usedMoves = new Set(), usedAbilities = new Set();
const speciesBan = /banned|not available|nonexistent|unreleased|does not exist|only obtainable|isn't/i;
for (const s of dex.species.all()) {
  if (s.isNonstandard || s.battleOnly || s.isCosmeticForme) continue;
  const pool = [...dex.species.getMovePool(s.id)].map(id => dex.moves.get(id)).filter(m => m.exists && !m.isNonstandard && !v.checkCanLearn(m, s));
  if (!pool.length) continue;
  const abil = Object.values(s.abilities).filter(a => !dex.abilities.get(a).isNonstandard);
  const set = {species: s.name, ability: abil[0], moves: [pool[0].name], nature: 'Serious', level: 50, evs: {hp:0,atk:0,def:0,spa:0,spd:0,spe:0}, ivs: {hp:31,atk:31,def:31,spa:31,spd:31,spe:31}};
  if (s.requiredItem) set.item = s.requiredItem;
  const probs = v.validateSet(set, {}) || [];
  const bad = probs.filter(p => speciesBan.test(p) && !/Stat Points/.test(p));
  if (bad.length) continue;
  const megas = [];
  for (const f of s.otherFormes || []) {
    const m = dex.species.get(f);
    if (!m.isMega || !m.requiredItem || dex.items.get(m.requiredItem).isNonstandard) continue;
    megas.push({name: m.name, item: m.requiredItem, types: m.types, stats: m.baseStats, ability: m.abilities[0], sprite: m.spriteid});
    usedAbilities.add(m.abilities[0]);
  }
  pool.forEach(m => usedMoves.add(m.id)); abil.forEach(a => usedAbilities.add(a));
  out.species.push({id: s.id, name: s.name, types: s.types, stats: s.baseStats, abilities: abil, moves: pool.map(m => m.id).sort(),
    sprite: s.spriteid, num: s.num, weight: s.weightkg, ...(s.requiredItem ? {requiredItem: s.requiredItem} : {}), ...(megas.length ? {megas} : {})});
}
for (const id of [...usedMoves].sort()) { const m = dex.moves.get(id);
  out.moves[id] = {name: m.name, type: m.type, cat: m.category, bp: m.basePower, acc: m.accuracy === true ? 0 : m.accuracy, pp: m.pp, pri: m.priority, target: m.target, desc: m.shortDesc || m.desc}; }
for (const a of [...usedAbilities].sort()) { const x = dex.abilities.get(a); out.abilities[x.id] = {name: x.name, desc: x.shortDesc || x.desc}; }
for (const i of dex.items.all()) { if (i.isNonstandard) continue; out.items[i.id] = {name: i.name, desc: i.shortDesc || i.desc, ...(i.megaStone ? {mega: Object.keys(i.megaStone)[0]} : {}), sprite: i.spritenum}; }
for (const n of dex.natures.all()) out.natures[n.id] = {name: n.name, plus: n.plus || null, minus: n.minus || null};
// Type chart: attacking type -> defending type -> multiplier
out.typeChart = {};
const types = dex.types.all().filter(t => !t.isNonstandard && t.name !== 'Stellar').map(t => t.name);
for (const atk of types) { out.typeChart[atk] = {}; for (const def of types) { const d = dex.types.get(def).damageTaken[atk]; out.typeChart[atk][def] = [1, 2, 0.5, 0][d]; } }
fs.writeFileSync(process.argv[2], JSON.stringify(out));
console.log(out.format, 'species', out.species.length, 'megas', out.species.reduce((a, s) => a + (s.megas?.length || 0), 0), 'moves', Object.keys(out.moves).length, 'abilities', Object.keys(out.abilities).length, 'items', Object.keys(out.items).length, 'types', types.length);
