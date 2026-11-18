export type ProjectStatus = "live" | "shipped" | "in-progress" | "concept" | "research";

export type Metric = {
  label: string;
  value: string;
  // Where the number comes from (test split, run id, notebook). Omit `value` rather than guess.
  source: string;
};

// Interactive charts rendered inside a Results finding. Keys map to client components in the project page.
export type DemoKey = "hook-lift" | "conformal-coverage" | "ballroom-baselines";

export type Finding = { title: string; body: string; demo?: DemoKey };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  // Shown after the status, e.g. "Paper in preparation" or a target date.
  statusNote?: string;
  accent: string;
  tags: string[];
  // Live demo URL. When empty, the page shows a "demo in progress" panel instead of an embed.
  demoUrl: string;
  // Empty when the code is not public.
  repoUrl: string;
  // A write-up hosted on this site or elsewhere, e.g. "/papers/senti.pdf".
  paperUrl?: string;
  // A tool hosted on this site, e.g. "/vgc", linked from the project page.
  tool?: { href: string; label: string };
  // One sentence of evidence for lists: the headline number, or what is done when there is none yet.
  result?: string;
  // Optional figure for the notebook grid and the project page header. Omit until a real export exists.
  figure?: { src: string; alt: string; caption: string; source: string };
  problem: string;
  exists: string[];
  approach: { title: string; body: string; formula?: string }[];
  architecture: string[];
  // Results told as findings, in order, before the metrics table. Every number in them needs a source too.
  findings?: Finding[];
  metrics: Metric[];
  limitations: string[];
  next: string[];
  credits?: string;
  // What I thought going in, and what the work showed instead. Only where the record supports it.
  surprise?: { expected: string; happened: string };
};

const allProjects: Project[] = [
  {
    slug: "senti",
    name: "senti",
    tagline: "Drag a point across a mood map and find songs that feel the way you do.",
    status: "live",
    accent: "var(--accent)",
    tags: ["NLP", "BERT", "Audio", "PyTorch", "Regression"],
    demoUrl: "https://moodify-navy-three.vercel.app",
    repoUrl: "https://github.com/jason-d-garcia/senti",
    paperUrl: "/papers/senti.pdf",
    result: "Lyrics + audio model: r = 0.77 valence, 0.77 arousal on 206 held-out songs; arousal r = 0.85 against 15 listeners.",
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
    surprise: {
      expected:
        "That more model would mean a better map: adding audio would help both axes, and fine-tuning the audio model would help again.",
      happened:
        "Audio helped arousal a lot and valence barely at all. Fine-tuning the audio model beat the frozen one on the benchmark but not with real listeners, so the simpler frozen model is the one that stayed live.",
    },
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
    result: "95.6% accuracy on 618 held-out clips across 10 styles; best non-foundation baseline 88.8%.",
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
    findings: [
      {
        title: "The foundation model beats every baseline",
        body: "Tempo alone gets far when the tempo label is exact, and hand-built rhythm features get further. The frozen MERT model with a small probe is the only one past 90%. Switch between accuracy and macro-F1: the order holds for both.",
        demo: "ballroom-baselines",
      },
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
  {
    slug: "coding-agent-harness",
    name: "Coding-agent harness",
    tagline: "A better harness for AI coding agents on a team new to them, and a blinded test of what makes their output reliable.",
    status: "in-progress",
    statusNote: "Internship",
    accent: "var(--accent)",
    tags: ["AI coding agents", "Experiment design", "LLM evaluation", "Python"],
    demoUrl: "",
    repoUrl: "",
    result: "Blinded pilot, 16 runs: example cards kept scores within 54-59% vs 39-62% for a COSPEC-style method, in a third fewer rounds at equal cost. Correctness was the same (55.5% vs 54.9%).",
    problem:
      "I'm a Data Science Intern at The Church of Jesus Christ of Latter-day Saints, in Meetinghouse & Facilities. The team I work with is hesitant to adopt AI, and fairly so: an agent that writes plausible code that misses the point costs time. I'm building a better harness for AI coding agents and measuring whether it actually saves the team time. The first question was what limits an agent's output on the team's real work, so I ran a measured pilot on how the agent clarifies requirements before it writes code.",
    exists: [
      "A test harness that runs a coding agent (Claude) through a requirement-clarification method on a historical team task, one where a person had to clarify the requirements, under a fixed compute budget.",
      "A reproducible adaptation of a published spec-clarification method (COSPEC), and an alternative \"example card\" method that pins requirements down as concrete examples. I fixed a gate and budget deadlock in the example-card tooling before freezing the protocol.",
      "A preregistered, blinded pilot: 16 agent runs in matched pairs, each scored blind against a hidden 61-case test suite. No infrastructure failures, at about $11 and 36 minutes per run.",
    ],
    approach: [
      {
        title: "Clarify before coding",
        body: "An agent can only build what it has been told. Both methods have the agent ask about the requirements before it writes code; they differ in how the answers are captured.",
      },
      {
        title: "Two methods, matched pairs",
        body: "A COSPEC-style method, adapted from published work on spec clarification, against example cards. Each pair ran the same task under the same budget, so differences come from the method, not the task.",
      },
      {
        title: "Preregistered and blinded",
        body: "The analysis was written down before any runs. Every run was scored against a hidden 61-case test suite by a blinded LLM judge, with multiple-comparison correction and documented deviations from the protocol.",
      },
    ],
    architecture: [
      "Historical task where a person had to clarify requirements",
      "Clarification method (COSPEC-style or example cards)",
      "Coding agent run under a fixed budget",
      "Blind scoring against a hidden 61-case test suite",
      "Preregistered paired analysis",
    ],
    findings: [
      {
        title: "Example cards made runs far more consistent",
        body: "Example-card runs stayed within 54-59% of the hidden tests; COSPEC-style runs ranged from 39% to 62%. Example cards also converged in a third fewer rounds, at the same cost.",
      },
      {
        title: "But not more correct",
        body: "Mean correctness was the same for both methods, 55.5% vs 54.9%. Structured clarification makes runs more consistent, not more complete.",
      },
      {
        title: "Unstated requirements were the limit",
        body: "The main limit on the agents' output was requirements nobody had written down, not the quality of the code they wrote. That finding shaped the design of the follow-up experiment.",
      },
    ],
    metrics: [
      {
        label: "Score range across runs",
        value: "54–59% vs 39–62%",
        source: "Share of a hidden 61-case test suite passed, example cards vs COSPEC-style. 16 runs in matched pairs, scored blind.",
      },
      {
        label: "Mean correctness",
        value: "55.5% vs 54.9%",
        source: "Same runs and order. The pilot rules out a large difference between the methods, not a small one.",
      },
      {
        label: "Rounds to converge",
        value: "A third fewer",
        source: "Example cards vs COSPEC-style, at equal cost per run.",
      },
      {
        label: "Cost per run",
        value: "~$11, 36 min",
        source: "Average per agent run within a fixed compute budget. 16 runs, no infrastructure failures.",
      },
    ],
    surprise: {
      expected: "That a more structured way of clarifying requirements would make the agent's code more correct.",
      happened:
        "Correctness came out the same. Example cards made runs steadier and quicker to converge, but what held every run back was requirements nobody had stated, not the code itself.",
    },
    limitations: [
      "A small pilot: one task and 8 matched pairs. It rules out a large difference between the methods, not a small one.",
      "Passing a hidden test suite is a proxy for doing what the person wanted, and the pilot doesn't yet measure time saved.",
      "Ticket contents, internal systems and code are confidential, so this page describes the method and the numbers only.",
    ],
    next: [
      "Run the follow-up experiment, designed around surfacing unstated requirements.",
      "Measure whether the harness saves the team time on real work, the question the team cares about.",
      "Add more tasks, so a smaller difference between methods could be detected.",
    ],
  },
  {
    slug: "vgc-team-generation",
    name: "VGC team generation",
    tagline: "Quality-diversity search for Pokémon doubles teams that are strong and different from each other.",
    status: "in-progress",
    statusNote: "Paper in preparation",
    accent: "var(--accent)",
    tags: ["Evolutionary search", "MAP-Elites", "Simulation", "Rust"],
    demoUrl: "",
    repoUrl: "",
    tool: { href: "/vgc", label: "Open the team builder" },
    result: "Rust battle engine matches Pokémon Showdown on 99.5-100% of outcomes at 30-45x its speed. Archive results targeted for early Dec 2026.",
    problem:
      "In competitive Pokémon doubles (VGC), players bring a team of six under a rule set that changes every few months, and the number of legal teams is enormous. Most players start from teams that already win. We want a search that returns many strong teams that play in different ways, so players can find good ideas outside the current meta.",
    exists: [
      "A Rust battle engine that ports Pokémon Showdown's rules for the full Regulation M-B pool. I directed AI coding agents to build it and validated it against Showdown: 99.5-100% of simulated outcomes match, at 30-45x Showdown's speed, so each candidate team can be played against meta teams many times.",
      "A pilot evaluation on VGC-Bench that scores a team by its win rate against Regulation M-B meta teams, weighted by how often each meta team is used.",
      "A team builder on this site that checks a team's legality and suggests fills for unlocked slots.",
    ],
    approach: [
      {
        title: "Quality-diversity search",
        body: "MAP-Elites keeps an archive of teams sorted into bins by features that describe how a team plays, and keeps only the best team in each bin. The result is a spread of strong teams with different styles, not a single winner.",
      },
      {
        title: "Scored by playing, not by a formula",
        body: "Each candidate is scored by simulated battles against the teams people actually use, weighted by usage, instead of by a hand-written rating of the team.",
      },
    ],
    architecture: [
      "Legal Pokémon pool for the format",
      "Team generator + MAP-Elites archive",
      "Rust battle engine (validated against Showdown)",
      "Usage-weighted win rate",
      "Archive of strong, varied teams",
    ],
    metrics: [
      {
        label: "Engine agreement with Showdown",
        value: "99.5–100%",
        source: "Share of simulated battle outcomes that match Pokémon Showdown on the same inputs, across the validation runs reported in the Nov 2026 project update. Archive results (team quality and diversity) are not in yet.",
      },
      {
        label: "Engine speed",
        value: "30–45x",
        source: "Battles per second relative to Pokémon Showdown on the same hardware, same validation runs.",
      },
    ],
    limitations: [
      "No search results yet. MAP-Elites has not been run at scale, so there is nothing to report on team quality or diversity until early December.",
      "Win rate depends on the battle agent that plays the teams, so it measures a team as that agent plays it.",
      "The engine was built by AI coding agents under my direction; the validation against Showdown is what I stand behind, not every line of the port.",
    ],
    next: [
      "Connect the genetic search to the team builder, so it fills the slots a player leaves unlocked.",
      "Run MAP-Elites over full teams on the Rust engine and report quality and diversity (target: early Dec 2026).",
      "Write up the method and results as a paper.",
    ],
    credits: "Built with Bryce Martin as a Computational Creativity class project.",
  },
  {
    slug: "tiktok-conformal",
    name: "TikTok forecasting",
    tagline: "Which kinds of videos do better than a creator's usual, and how sure can a forecast be?",
    status: "in-progress",
    statusNote: "Write-up targeted for Dec 2026",
    accent: "var(--accent)",
    tags: ["Forecasting", "Conformal prediction", "CLIP", "PyTorch", "Python"],
    demoUrl: "",
    repoUrl: "",
    tool: { href: "/creator-studio", label: "Try the draft comparison" },
    result: "Some opening types do 1.2-1.4x a creator's usual views across 1,637 creators; a personal model for one creator spots breakouts at AUC ~0.85.",
    problem:
      "A creator deciding what to post wants to know two things: what tends to do well, and how sure any forecast is. This started as a CS 580 class project that predicted a post's views. I rebuilt it to measure what kinds of content beat a creator's own norm, to forecast with intervals that say how sure they are, and to test whether a model fit to one creator's history does better than a general one.",
    exists: [
      "A leakage audit of the original class project. It found three leaks (PCA fit before the train/test split, two cross-validation modes that produced identical folds, and momentum features that used future view counts) and replaced them with a leakage-safe evaluation and a simple creator baseline: the median of the creator's last 10 posts.",
      "A data pipeline over three public datasets, scaled to about 44,000 clips from 1,637 creators (median 30 posts each) across 50 topics, with CLIP, X-CLIP and Whisper embeddings of each video's opening seconds and splits that keep creators and time apart. Processed on Modal, Google Colab and BYU's Slurm GPU cluster (about 120 P100 GPU-hours).",
      "Eight-plus model families on the same creator-grouped folds, from ridge and gradient boosting to a fine-tuned CLIP ensemble, self-supervised pretraining and per-creator adaptation, each with a shuffled-label control.",
      "Split, CQR and Mondrian conformal intervals on SMP-Video (4,000 posts from 3,488 creators).",
      "A study of one ~1M-follower creator's own videos, with hand-labelled opening formats and a learning curve for how many posts a personal model needs.",
      "A draft comparison tool on this site that ranks versions of a post with view ranges, running on a placeholder predictor until a trained model is wired in.",
    ],
    approach: [
      {
        title: "Compare a post with its own creator",
        body: "Most of the variation in views is between creators, so a post is scored against the median of the same creator's previous 10 posts. A content effect then means \"this kind of video does better than this creator usually does\", not \"big accounts get more views\".",
      },
      {
        title: "Opening types from the first three seconds",
        body: "Each clip's first 3 seconds are embedded with CLIP and clustered with k-means (k = 12, chosen on cluster quality and stability across random halves). Lift is measured within creators, with bootstrap intervals over creators.",
      },
      {
        title: "Conformal intervals, grouped by creator size",
        body: "Conformal prediction wraps any forecast in an interval that covers the true value at a chosen rate on held-out data. Mondrian conformal calibrates each creator-size group separately, so the promise holds for small creators too, not only on average.",
      },
    ],
    architecture: [
      "Public TikTok datasets + one creator's own videos",
      "Leak-free, creator-disjoint splits",
      "Opening-seconds embeddings (CLIP, X-CLIP, Whisper) + captions",
      "Cluster lifts, breakout models, conformal intervals",
      "Draft comparison tool",
    ],
    findings: [
      {
        title: "Some kinds of opening do better across creators",
        body: "Across 44,030 clips from 1,637 creators, the best opening types draw 1.2-1.4x the same creator's usual views, and the worst about 0.8x. The ranking replicates between earlier and later posts. These are real effects, even though content does not beat the creator baseline on forecast error.",
        demo: "hook-lift",
      },
      {
        title: "For one creator, a content type broke out far more often, and it was predictable",
        body: "On a ~1M-follower creator's own videos, one opening format broke out far more often than the rest. A personal model built on the opening seconds spotted the creator's breakouts at AUC ~0.85 (leave-one-out), and ~0.80 with only 15-20 posts of history. The general cross-creator model managed ~0.56 on the same videos.",
      },
      {
        title: "Early metrics look like the most workable forecast",
        body: "A hazard-gate experiment modelled breakout from a post's early metrics after publishing. Of the approaches tried, it was the most viable. It needs metrics pulled at fixed times after posting, and the public datasets here have one snapshot per post, so the next step is research data access.",
      },
      {
        title: "Mondrian conformal keeps the promise for small creators",
        body: "At a 90% target, plain split conformal covered the smallest creators' posts only 80% of the time; Mondrian covered 91%, with no wider intervals. The honest catch is width: even the best 90% interval spans about 85x in daily views from end to end. Move the slider to compare creator sizes.",
        demo: "conformal-coverage",
      },
      {
        title: "What didn't work, with intervals",
        body: "Masked-autoencoder pretraining scored about 0.035-0.045 AUC below plain CLIP. Caption-to-opening contrastive pretraining lost 0.015 AUC [-0.027, -0.004]. MAML per-creator adaptation hurt, and in-context personalisation added only 0.005-0.010 Spearman. Frame order adds nothing: shuffled frames score the same, and the signal sits in the first 3 seconds.",
      },
    ],
    metrics: [
      {
        label: "Best opening types vs creator's norm",
        value: "1.2–1.4x",
        source: "Within-creator lift of the top five of 12 k-means opening clusters, 44,030 clips from 1,637 creators, 95% bootstrap intervals above 1. Early vs late replication r = +0.77.",
      },
      {
        label: "Personal breakout model",
        value: "AUC ~0.85",
        source: "One ~1M-follower creator, leave-one-out on her own videos; ~0.80 with 15-20 posts of history, vs ~0.56 zero-shot from the cross-creator model.",
      },
      {
        label: "Cross-creator breakout model",
        value: "AUC 0.589",
        source: "10-model fine-tuned CLIP ensemble on the opening seconds, unseen creators, 44K clips; shuffled-label null ~0.50. Spearman 0.125.",
      },
      {
        label: "Interval coverage",
        value: "91%",
        source: "Mondrian conformal at a 90% target on SMP-Video (4,000 posts, 3,488 creators, 5-fold creator-disjoint CV), 90-91% in every creator-size quartile. Plain split conformal: 80% for the smallest creators.",
      },
      {
        label: "Ranking from captions",
        value: "0.11 → 0.42",
        source: "Spearman on SMP-Video, creator-disjoint CV: metadata only vs adding CLIP caption embeddings (0.33 with TF-IDF text). Adding creator stats reaches 0.70, but those are read after posting.",
      },
      {
        label: "Creator baseline vs original model",
        value: "MAE 0.91 vs 1.02",
        source: "Median of the creator's last 10 posts vs the original project's best XGBoost model, log-views, 3 chronological folds. A random-embedding control also scored 1.02.",
      },
    ],
    surprise: {
      expected:
        "That what is in a video would predict how it does. The original class project reported exactly that, and I set out to improve its model.",
      happened:
        "Three data leaks explained the original result. With them fixed, the median of a creator's last 10 posts beat the model. Content effects are real but small across creators, and much stronger inside one creator's own history.",
    },
    limitations: [
      "Content alone carries a small signal across creators (breakout AUC ~0.58 against a 0.50 null). Most of the variance, 94%, is within a creator's own posts.",
      "Intervals are honest but wide: the best 90% interval spans about 85x in daily views.",
      "The single-creator result is one creator. Creators in the large set with 25-30 clips showed no per-creator signal, so 15-20 posts is not enough in general.",
      "SMP-Video creator stats are read after posting, which the benchmark allows but a real forecast would not have.",
    ],
    next: [
      "Get research data access to pull a post's metrics at fixed times after publishing, and test the hazard gate on it.",
      "Write up the results (target: Dec 2026).",
      "Wire a trained model into the draft comparison tool.",
    ],
  },
  {
    slug: "tutoring-assistant",
    name: "Tutoring assistant",
    tagline: "An idea for a tutor that pays attention to how students see themselves as learners.",
    status: "concept",
    accent: "var(--accent)",
    tags: ["Learning science", "LLMs", "Concept"],
    demoUrl: "",
    repoUrl: "",
    problem:
      "How students see themselves as learners shapes what they are willing to try. Most tutoring software tracks which answers a student gets right, not whether they believe they can learn the material. I want to build a tutor that pays attention to both, because every student deserves a fair chance to learn.",
    exists: [],
    approach: [
      {
        title: "What it would do",
        body: "Notice signs of how a student sees themself as a learner during a session and adjust the help it gives, alongside the usual work on the material.",
      },
    ],
    architecture: [],
    metrics: [],
    limitations: ["This is a concept. Nothing is built yet."],
    next: ["Read the research on learner identity in tutoring.", "Sketch a small prototype to test the idea."],
  },
];

// Projects with real work behind them, in display order. Ideas with nothing built yet live on /explorations;
// their pages still exist (see projectPages) so old links keep working.
const order = ["senti", "coding-agent-harness", "tiktok-conformal", "ballroom", "vgc-team-generation"];
export const projects: Project[] = order.map((slug) => allProjects.find((p) => p.slug === slug)!);
// The home page's selected work. Only projects with a measured result: no method sketch in a featured slot.
const featured = ["senti", "coding-agent-harness", "tiktok-conformal", "ballroom"];
export const featuredProjects: Project[] = featured.map((slug) => allProjects.find((p) => p.slug === slug)!);
export const projectPages: Project[] = allProjects;

export const getProject = (slug: string) => allProjects.find((p) => p.slug === slug);

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live demo",
  shipped: "Shipped",
  "in-progress": "In progress",
  concept: "Concept",
  research: "Research",
};

export const statusText = (p: Project) => [statusLabel[p.status], p.statusNote].filter(Boolean).join(" · ");
