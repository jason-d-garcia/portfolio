export type ProjectStatus = "live" | "shipped" | "in-progress" | "concept" | "research";

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
    name: "senti",
    tagline: "Drag a point across a mood map and find songs that feel the way you do.",
    status: "live",
    accent: "var(--accent)",
    tags: ["NLP", "BERT", "Audio", "PyTorch", "Regression"],
    demoUrl: "https://moodify-navy-three.vercel.app",
    repoUrl: "https://github.com/jason-d-garcia/senti",
    problem:
      "Music apps sort by genre and artist, but people usually look for songs by feeling. senti (formerly Moodify) places songs on a valence (feels bad to feels good) by arousal (calm to wired) map, cut into 16 emotions from Russell's circumplex model, so you can browse by mood directly. No login needed.",
    exists: [
      "A BERT regressor that reads a song's lyrics and predicts valence and arousal directly, trained on 2,044 MERGE songs.",
      "A live map of 5,411 Billboard year-end hits (1960-2025), scored over their whole lyric, plus 254 held-out test songs the model never saw in training. Songs play 30-second previews and link to Spotify.",
      "A listener rating mode: people confirm a song's spot or drag it to where it belongs, a third of the time blind to the model's guess. Rated songs move toward the listeners' median placement.",
      "Audio from a frozen music model (MERT) run on each song's 30-second preview and blended with the lyrics score. The 2,568 hits with a preview are placed by the blend, and the rest by lyrics alone.",
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
        title: "Adding audio",
        body: "Each 30-second clip is embedded by MERT-v1-95M, frozen, in 5-second slices. A ridge regression maps the embeddings to valence and arousal, with the layer chosen on validation songs (layer 6). A linear blend of the lyrics and audio scores, fitted on validation songs, gives the final position. On the live map, the audio comes from each song's Apple preview, scored on a cloud GPU (Modal) in one batch.",
      },
      {
        title: "Retrieval",
        body: "Song coordinates are precomputed offline. The map ranks songs by distance to the selected point, so the live site is static and needs no GPU.",
      },
    ],
    architecture: [
      "Lyrics (fetched locally)",
      "BERT valence/arousal regressor (offline)",
      "MERT audio model on 30-second previews (offline, GPU)",
      "Static song catalog",
      "Interactive mood map + Spotify links",
    ],
    metrics: [
      {
        label: "Valence correlation",
        value: "0.72",
        source: "Lyrics model, Pearson r on 256 held-out MERGE songs (R² 0.52, MAE 0.23). Four-class baseline: 0.46.",
      },
      {
        label: "Arousal correlation",
        value: "0.61",
        source: "Lyrics model, Pearson r on the same songs (R² 0.36, MAE 0.18). Four-class baseline: 0.11.",
      },
      {
        label: "Arousal with audio",
        value: "0.61 → 0.77",
        source: "Lyrics + audio vs lyrics alone, Pearson r on the 206 test songs with audio clips (valence 0.72 → 0.77). Paired bootstrap 95% intervals for the gain exclude zero on both axes.",
      },
      {
        label: "Arousal vs listeners",
        value: "0.57 → 0.85",
        source: "Lyrics alone vs lyrics + audio, Pearson r against the median placement from 15 study listeners on 100 songs (3+ raters each). Valence: 0.63 → 0.65, a gain within noise.",
      },
    ],
    limitations: [
      "MERGE's valence and arousal come from AllMusic mood tags mapped through word norms, not from listeners rating each song, so the target is noisy.",
      "Predictions are pulled toward the centre. The test songs leave Nervous and Tense empty; with the Billboard hits every section has songs.",
      "2,843 of the 5,411 hits have no Apple preview, so they are still placed by lyrics alone.",
      "Audio helps arousal far more than valence: with listeners, the blend barely beats lyrics on valence.",
      "The listener check is small (15 raters, 100 songs), and one rater repeating a song agrees with themself at about r 0.7, so single ratings are noisy too.",
      "The model was starting to overfit by its fifth and final epoch.",
    ],
    next: [
      "Train on a larger set (Deezer) once lyric fetching is set up.",
      "Find previews for the hits that lack one, so audio covers the whole map.",
      "Grow the rating study past 15 listeners and re-check the blend.",
    ],
    credits:
      "Valence/arousal labels from MERGE (Louro et al., 2024, Zenodo 13939205), licensed CC BY-NC 4.0. senti is non-commercial, and lyrics are never stored in the repo.",
  },
  {
    slug: "ballroom",
    name: "Ballroom style finder",
    tagline: "Tell which ballroom dance a song fits, to find new music to dance to.",
    status: "shipped",
    accent: "var(--accent)",
    tags: ["Audio", "MERT", "Foundation models", "PyTorch", "Classification"],
    demoUrl: "",
    repoUrl: "https://github.com/jason-d-garcia/ballroom-music-classifier",
    problem:
      "Ballroom dancers need music in the right style and tempo, but streaming apps don't tag songs by dance. This model listens to a 30-second clip and reports its three most likely ballroom styles, so a dancer can scan an album or playlist for new practice music.",
    exists: [
      "A classifier for 10 styles (cha-cha, foxtrot, jive, paso doble, quickstep, rumba, samba, tango, Viennese waltz, waltz), trained on the 4,180 clips of the Extended Ballroom dataset.",
      "A command-line tagger that takes a list of titles and artists, fetches 30-second previews, and returns each song's top three styles with probabilities. It also tags local audio files.",
      "Five baselines on the same split, from zero-shot CLAP to tempo-only and hand-built rhythm features, so the gain from the foundation model is measured rather than assumed.",
    ],
    approach: [
      {
        title: "Frozen music foundation model",
        body: "No usable pre-trained ballroom classifier exists, so each clip is embedded by MERT-v1-95M, a self-supervised music model, kept frozen. A small MLP probe learns a weighted mix of MERT's layers and predicts the style. Training takes minutes on a laptop.",
      },
      {
        title: "A split that can't leak",
        body: "Ballroom datasets repeat songs: 4,110 clips fall into 3,608 duplicate groups, by title and artist, the dataset's own duplicate links, and near-identical audio. The 70/15/15 split keeps every group on one side, so the test set never contains a copy of a training song.",
      },
      {
        title: "Where the rhythm lives",
        body: "The learned layer weights peak at MERT's middle layers (3 and 7). Single-layer probes peak at layer 4 and fall off at the top layer, so dance style is a rhythm feature that the model's final layers partly discard.",
      },
    ],
    architecture: [
      "30-second preview or local file",
      "MERT-v1-95M embeddings (frozen)",
      "Layer-mixing MLP probe",
      "Top three styles with probabilities",
    ],
    metrics: [
      {
        label: "Accuracy",
        value: "95.6%",
        source: "MERT + probe on 618 held-out test clips (top-2 98.5%). Published reference: 93.9% (Pavlin et al. 2020), on a different split.",
      },
      {
        label: "Macro-F1",
        value: "0.947",
        source: "Same test clips. Weakest classes: rumba 0.90 (often called waltz) and paso doble 0.84, which has only 8 test clips.",
      },
      {
        label: "Best baseline",
        value: "88.8%",
        source: "Tempogram + MFCC features with logistic regression on the same split. Tempo alone from the dataset's BPM: 87.4%.",
      },
      {
        label: "Zero-shot CLAP",
        value: "14.9%",
        source: "Text prompts with no training. CLAP knows genres but not ballroom dance names.",
      },
    ],
    limitations: [
      "Extended Ballroom is competition ballroom music. The pop songs dancers actually look for are out of domain, so a small hand-labelled set of real songs is still needed to test the discovery use case.",
      "Many songs fit several dances (a 120 BPM song in 4/4 can be a foxtrot or a cha-cha), which is why it reports three styles, not one.",
      "It reads 30-second previews, not whole songs.",
    ],
    next: [
      "Hand-label a set of popular songs dancers use and measure accuracy on them.",
      "Pose estimation on ballroom dance video, as a follow-on project.",
    ],
    credits:
      "Extended Ballroom dataset (Marchand & Peeters, 2016). MERT-v1-95M (m-a-p). Audio is never stored in the repo.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live demo",
  shipped: "Shipped",
  "in-progress": "In progress",
  concept: "Concept",
  research: "Research",
};
