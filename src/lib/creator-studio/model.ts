// Browser port of the Creator Studio stub predictor from tiktok-virality-prediction.
// median = the creator's typical views + small hand-set nudges (placeholders, not learned).
// The interval half-width comes from split conformal on the stub's one-step-ahead
// residuals over one creator's history: about ±0.64 log10 (~4x either way) for 80% coverage,
// with 87% coverage on the newer, held-out 40% of posts.

export const COVERAGE = 0.8;
export const HALF_WIDTH = 0.64; // log10 views
export const TIE_DELTA = 0.15; // log10 views, ~1.4x

export type Draft = { id: number; hook: string; caption: string; lengthS: number; hour: number };
export type Driver = { label: string; delta: number };
export type Prediction = { id: number; median: number; lower: number; upper: number; baseline: number; drivers: Driver[] };
export type Ranked = Prediction & { rank: number; tier: number; gap: number };

const CURIOSITY = new Set(["why", "how", "what", "secret", "never", "nobody", "wait", "watch", "pov", "you"]);
const HASHTAG = /#(\w+)/g;

const words = (s: string) => s.split(/\s+/).filter(Boolean);
const tagCount = (caption: string) => (caption.match(/#/g) ?? []).length;
const captionText = (caption: string) => caption.replace(HASHTAG, "").trim();

export function drivers(d: Draft): Driver[] {
  const out: Driver[] = [];
  const w = words(d.hook.toLowerCase());
  if (w.length === 0) out.push({ label: "No hook", delta: -0.1 });
  else {
    const curious = d.hook.includes("?") || /\d/.test(d.hook) || w.some((x) => CURIOSITY.has(x.replace(/[?!.,]/g, "")));
    if (curious) out.push({ label: "Hook creates curiosity", delta: 0.05 });
    if (w.length > 12) out.push({ label: "Hook is long (>12 words)", delta: -0.05 });
  }
  const n = tagCount(d.caption);
  if (n === 0) out.push({ label: "No hashtags", delta: -0.05 });
  else if (n >= 3 && n <= 6) out.push({ label: "3 to 6 hashtags", delta: 0.03 });
  else if (n > 8) out.push({ label: "Too many hashtags (>8)", delta: -0.05 });
  if (d.lengthS >= 7 && d.lengthS <= 30) out.push({ label: "Length 7 to 30 s", delta: 0.03 });
  else if (d.lengthS > 60) out.push({ label: "Over 60 s", delta: -0.05 });
  if (d.hour >= 17 && d.hour <= 22) out.push({ label: "Evening posting slot", delta: 0.03 });
  else if (d.hour >= 1 && d.hour <= 6) out.push({ label: "Late-night posting slot", delta: -0.03 });
  return out;
}

export function predict(d: Draft, typicalViews: number): Prediction {
  const baseline = Math.log10(Math.max(typicalViews, 1));
  const ds = drivers(d);
  const median = baseline + ds.reduce((s, x) => s + x.delta, 0);
  return { id: d.id, median, lower: median - HALF_WIDTH, upper: median + HALF_WIDTH, baseline, drivers: ds };
}

// Sort by median; open a new tier when a draft falls more than TIE_DELTA below the tier's first draft.
export function assignTiers(preds: Prediction[]): Ranked[] {
  const order = [...preds].sort((a, b) => b.median - a.median);
  let tier = 0;
  let anchor: number | null = null;
  return order.map((p, i) => {
    if (anchor === null || anchor - p.median > TIE_DELTA) {
      tier += 1;
      anchor = p.median;
    }
    return { ...p, rank: i + 1, tier, gap: order[0].median - p.median };
  });
}

export function feedback(d: Draft): { notes: string[]; edits: string[] } {
  const notes: string[] = [];
  const edits: string[] = [];
  const w = words(d.hook);
  if (w.length === 0) {
    notes.push("No hook: the first seconds give viewers no reason to stay.");
    edits.push("Open with a question or a promise of what they'll see.");
  } else if (w.length > 12) {
    notes.push(`Hook is ${w.length} words; viewers decide in 1 to 3 seconds.`);
    edits.push("Cut the hook to under 10 words, leading with the most surprising part.");
  } else if (!d.hook.includes("?")) {
    notes.push("Hook is short, which is good.");
    edits.push("Try phrasing the hook as a question to create curiosity.");
  } else notes.push("Hook is short and poses a question.");

  const n = tagCount(d.caption);
  if (n === 0) {
    notes.push("No hashtags, so the video is harder to place for new viewers.");
    edits.push("Add 3 to 6 hashtags mixing niche and broad tags.");
  } else if (n > 8) {
    notes.push(`${n} hashtags reads as spammy.`);
    edits.push("Trim to the 3 to 6 most relevant hashtags.");
  }
  const text = captionText(d.caption);
  if (!text) edits.push("Add a one-line caption that echoes the hook or invites comments.");
  else if (!text.includes("?") && !text.toLowerCase().includes("comment"))
    edits.push("End the caption with a light call to action, such as a question for comments.");
  if (d.lengthS > 60) {
    notes.push(`${Math.round(d.lengthS)} s is long; retention usually drops past a minute.`);
    edits.push("Test a cut under 30 s.");
  }
  return { notes, edits };
}

export function fmtViews(x: number): string {
  if (x >= 1e6) return `${(x / 1e6).toFixed(1)}M`;
  if (x >= 1e3) return `${Math.round(x / 1e3)}K`;
  return `${Math.round(x)}`;
}
