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
  credits?: string;
};

export const projects: Project[] = [
  {
    slug: "moodify",
    name: "Moodify",
    tagline: "Drag a point across a mood map and find songs that feel the way you do.",
    status: "live",
    accent: "var(--accent)",
    tags: ["NLP", "BERT", "PyTorch", "Regression"],
    demoUrl: "https://moodify-navy-three.vercel.app",
    repoUrl: "https://github.com/jason-d-garcia/moodify",
    problem:
      "Music apps sort by genre and artist, but people usually look for songs by feeling. Moodify places songs on a valence (feels bad to feels good) by arousal (calm to wired) map, cut into 16 emotions from Russell's circumplex model, so you can browse by mood directly. No login needed.",
    exists: [
      "A BERT regressor that reads a song's lyrics and predicts valence and arousal directly, trained on 2,044 MERGE songs.",
      "A live map of 254 held-out test songs the model never saw in training, each with a Spotify link.",
      "An earlier four-class mood classifier (happy, angry, sad, relaxed) that scores 88.7% on 141 held-out MoodyLyrics songs, kept as the baseline.",
    ],
    approach: [
      {
        title: "16 emotions, two axes",
        body: "The map follows Russell's circumplex: valence on x, arousal on y, cut into the 16 emotion words of Feldman Barrett & Russell (1998). A song's emotion is the section its predicted point falls in, and points near the centre are labelled Mixed.",
      },
      {
        title: "Baseline: class probabilities to coordinates",
        body: "The first version placed each song at the probability-weighted average of its four quadrant corners. That is an expected quadrant position, not a continuous estimate. It bunched songs near the diagonals and left 6 of the 16 sections empty.",
        formula: "V = p(happy) + p(relaxed) - p(angry) - p(sad)\nA = p(happy) + p(angry) - p(sad) - p(relaxed)",
      },
      {
        title: "Direct valence/arousal regression",
        body: "The current model is bert-base-cased with a two-output tanh head, trained to predict valence and arousal in [-1, 1]. It fills 13 of the 16 sections.",
      },
      {
        title: "Retrieval",
        body: "Song coordinates are precomputed offline. The map ranks songs by distance to the selected point, so the live site is static and needs no GPU.",
      },
    ],
    architecture: [
      "Lyrics (fetched locally)",
      "BERT valence/arousal regressor (offline)",
      "Static song catalog",
      "Interactive mood map + Spotify links",
    ],
    metrics: [
      {
        label: "Valence correlation",
        value: "0.70",
        source: "Pearson r on 256 held-out MERGE songs (R² 0.47, MAE 0.24). Four-class baseline: 0.46.",
      },
      {
        label: "Arousal correlation",
        value: "0.56",
        source: "Pearson r on the same songs (R² 0.29, MAE 0.19). Four-class baseline: 0.11.",
      },
      {
        label: "Quadrant match",
        value: "169 / 254",
        source: "Predicted quadrant matches the tagged quadrant for 67% of the songs shown on the map.",
      },
    ],
    limitations: [
      "MERGE's valence and arousal come from AllMusic mood tags mapped through word norms, not from listeners rating each song, so the target is noisy.",
      "Predictions are pulled toward the centre, and the Excited and Alert sections hold no songs yet.",
      "Lyrics only: tempo, key and production are not used.",
      "The model was starting to overfit by its fifth and final epoch.",
    ],
    next: [
      "Train on a larger set (Deezer) once lyric fetching is set up.",
      "Add audio features and compare lyrics + audio against lyrics alone.",
    ],
    credits:
      "Valence/arousal labels from MERGE (Louro et al., 2024, Zenodo 13939205), licensed CC BY-NC 4.0. Moodify is non-commercial, and lyrics are never stored in the repo.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live demo",
  "in-development": "In development",
  research: "Research",
};
