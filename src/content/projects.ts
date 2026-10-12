export type ProjectStatus = "live" | "in-development" | "research";

export type Metric = {
  label: string;
  value: string;
  // Where the number comes from (test split, run id, notebook). Omit `value` rather than guess.
  source: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  accent: string;
  tags: string[];
  // Live demo URL. When empty, the page shows a "demo in progress" panel instead of an embed.
  demoUrl: string;
  repoUrl: string;
  problem: string;
  exists: string[];
  approach: { title: string; body: string; formula?: string }[];
  architecture: string[];
  metrics: Metric[];
  limitations: string[];
  next: string[];
};

export const projects: Project[] = [
  {
    slug: "moodify",
    name: "Moodify",
    tagline: "Drag a point across a mood map and find songs that feel the way you do.",
    status: "in-development",
    accent: "var(--accent)",
    tags: ["NLP", "BERT", "PyTorch", "Next.js"],
    demoUrl: "",
    repoUrl: "https://github.com/jason-d-garcia/bert-lyrics-sentiment-analysis",
    problem:
      "Music apps sort by genre and artist, but people usually look for songs by feeling. Moodify places songs on a valence (negative to positive) by arousal (calm to energetic) grid so you can browse by mood directly, with no Spotify login required to explore.",
    exists: [
      "A bert-base-cased classifier fine-tuned on the MoodyLyrics dataset to predict one of four moods from lyrics: happy, angry, sad, relaxed.",
      "Training and evaluation pipeline in PyTorch (AdamW, linear decay, 160-token inputs, best checkpoint chosen on validation accuracy).",
    ],
    approach: [
      {
        title: "Four moods, two axes",
        body: "MoodyLyrics labels follow Russell's circumplex model, so each class sits in one quadrant of the valence and arousal plane.",
      },
      {
        title: "From class probabilities to coordinates",
        body: "The baseline places each song at the probability-weighted average of its quadrant corners. This is an expected quadrant position, not a supervised continuous estimate, so an uncertain prediction can look neutral.",
        formula: "V = p(happy) + p(relaxed) - p(angry) - p(sad)\nA = p(happy) + p(angry) - p(sad) - p(relaxed)",
      },
      {
        title: "Retrieval",
        body: "Song coordinates are precomputed offline. The grid ranks songs by distance to the selected point, so the live site needs no GPU.",
      },
    ],
    architecture: [
      "Lyrics catalog",
      "BERT mood classifier (offline)",
      "Valence/arousal coordinates",
      "Static catalog",
      "Interactive grid + Spotify links",
    ],
    metrics: [
      {
        label: "4-class test accuracy",
        value: "",
        source: "Pending re-run of eval.py on the held-out test split.",
      },
    ],
    limitations: [
      "Coordinates come from a 4-way classifier, not continuous valence/arousal labels.",
      "Lyrics alone miss mood carried by audio (tempo, timbre, key).",
      "MoodyLyrics labels are derived from word-level lexicon scores, so they are noisy proxies for listener-perceived mood.",
    ],
    next: [
      "Continuous valence/arousal regression on lyrics.",
      "Audio features and lyrics + audio fusion, compared against this quadrant baseline.",
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live demo",
  "in-development": "In development",
  research: "Research",
};
