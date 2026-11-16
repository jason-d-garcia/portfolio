/*
 * Numbers behind the interactive results charts. Each block names the report it is copied from; nothing here is
 * estimated or rounded beyond what the report prints.
 */

// TikTok: reports/stage3_hook_clusters.md (tiktok-virality-prediction). 44,030 clips from 1,637 creators; CLIP over
// the first 3 s; k-means with k = 12. "lift" is a cluster's median views relative to the same creator's other posts.
export const hookClusters = {
  source: "k-means hook clusters (k = 12) over 44,030 clips from 1,637 creators; within-creator lift with 95% bootstrap CI.",
  replication: 0.77,
  clusters: [
    { id: 11, name: "Hair, makeup, skincare (A)", labels: "hair tutorial, makeup tutorial, skincare routine", clips: 1232, creators: 217, lift: 1.41, lo: 1.11, hi: 1.77, early: 1.24, late: 1.4 },
    { id: 9, name: "Sports, workout, dance", labels: "sports highlight, workout video, dance video", clips: 1809, creators: 313, lift: 1.26, lo: 1.08, hi: 1.48, early: 1.36, late: 1.09 },
    { id: 1, name: "Outdoors, object close-ups", labels: "wide shot outdoors, extreme close-up of an object, nature scenery", clips: 4636, creators: 783, lift: 1.24, lo: 1.09, hi: 1.4, early: 1.16, late: 1.23 },
    { id: 10, name: "Memes, pets, motivational", labels: "meme, motivational speech, pets", clips: 3989, creators: 900, lift: 1.23, lo: 1.15, hi: 1.32, early: 1.26, late: 1.23 },
    { id: 6, name: "Street and beach", labels: "meme, street, beach", clips: 1259, creators: 176, lift: 1.2, lo: 1.01, hi: 1.43, early: 1.21, late: 1.14 },
    { id: 5, name: "Travel vlog, street", labels: "wide shot outdoors, travel vlog, street", clips: 5835, creators: 898, lift: 1.13, lo: 1.06, hi: 1.2, early: 1.09, late: 1.18 },
    { id: 8, name: "Food and cooking", labels: "food close-up, recipe tutorial, cooking video", clips: 1837, creators: 292, lift: 1.04, lo: 0.88, hi: 1.24, early: 0.94, late: 1.15 },
    { id: 0, name: "Text on a black screen", labels: "black screen with text, wide shot outdoors, text on screen", clips: 5059, creators: 878, lift: 0.98, lo: 0.91, hi: 1.06, early: 1.02, late: 0.91 },
    { id: 2, name: "Hair, makeup, skincare (B)", labels: "hair tutorial, makeup tutorial, skincare routine", clips: 3837, creators: 663, lift: 0.94, lo: 0.83, hi: 1.06, early: 1.0, late: 0.93 },
    { id: 7, name: "Photo slideshows, text cards", labels: "slideshow of photos, text on screen, black screen with text", clips: 4334, creators: 886, lift: 0.89, lo: 0.78, hi: 0.98, early: 0.97, late: 0.85 },
    { id: 4, name: "Hair, makeup, skincare (C)", labels: "hair tutorial, makeup tutorial, skincare routine", clips: 5021, creators: 551, lift: 0.83, lo: 0.76, hi: 0.93, early: 0.86, late: 0.79 },
    { id: 3, name: "Face-to-camera selfie", labels: "selfie close-up of a face, motivational speech, reaction video", clips: 3267, creators: 471, lift: 0.82, lo: 0.72, hi: 0.94, early: 0.84, late: 0.81 },
  ],
};

// TikTok: caption-topic lifts from the earlier CS 580 class-project report (point estimates only, no intervals).
export const topicLifts = [
  { topic: "travel", lift: "~1.2x" },
  { topic: "storytime", lift: "~1.15x" },
  { topic: "food ASMR", lift: "~0.87x" },
];

// TikTok: reports/smp_results.md. SMP-Video, 4,000 posts from 3,488 creators, 5-fold creator-disjoint CV, 90% target,
// content + CLIP caption features (no creator stats). Width is in label units of log2(views/day).
export const conformal = {
  target: 0.9,
  quartiles: ["Smallest creators", "Second quartile", "Third quartile", "Largest creators"],
  split: [0.8, 0.95, 0.94, 0.94],
  mondrian: [0.91, 0.9, 0.91, 0.91],
  overall: { split: 0.91, mondrian: 0.91 },
  width: { split: 8.7, mondrian: 8.6 },
};

// Ballroom: ballroom/README.md results table. 618 held-out test clips, Extended Ballroom, duplicate-aware split.
export const ballroomBaselines = [
  { model: "MERT + probe", note: "Frozen music foundation model, layer-mixing MLP probe", acc: 95.6, f1: 0.947, main: true },
  { model: "Tempogram + MFCC, logistic regression", note: "Hand-built rhythm and timbre features", acc: 88.8, f1: 0.86 },
  { model: "Annotated tempo only", note: "The dataset's own BPM label", acc: 87.4, f1: 0.86 },
  { model: "CLAP embeddings + probe", note: "General audio-text model, same kind of probe", acc: 83.8, f1: 0.82 },
  { model: "Estimated tempo only", note: "BPM estimated from the audio", acc: 57.1, f1: 0.48 },
  { model: "CLAP zero-shot", note: "Text prompts, no training", acc: 14.9, f1: 0.13 },
];
