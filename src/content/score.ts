/*
 * The data behind the home page's score. Each line of the staff is a discipline; each chord is one thing I have
 * built, am exploring, or do away from the keyboard, with a note on every discipline it touches.
 * `built: false` draws hollow notes: an idea with nothing behind it yet.
 */
export const staffLines = [
  "Machine learning",
  "Mathematics",
  "Search & optimization",
  "Products & interfaces",
  "Music",
  "Movement & sport",
  "Teaching",
] as const;

export type ScoreGroup = "Projects" | "Exploring" | "Beyond the code";

export type ScoreEntry = {
  name: string;
  group: ScoreGroup;
  // Indices into staffLines.
  lines: number[];
  built: boolean;
  note: string;
  href: string;
};

export const scoreEntries: ScoreEntry[] = [
  { name: "senti", group: "Projects", lines: [0, 3, 4], built: true, note: "A map of 5,411 songs you browse by feeling, placed by a lyrics and audio model.", href: "/projects/moodify" },
  { name: "Coding-agent harness", group: "Projects", lines: [0, 1, 3], built: true, note: "Internship: a better harness for AI coding agents, and a blinded pilot of how they should clarify requirements.", href: "/projects/coding-agent-harness" },
  { name: "TikTok forecasting", group: "Projects", lines: [0, 1, 3], built: true, note: "What beats a creator's own norm, with intervals that say how sure the forecast is.", href: "/projects/tiktok-conformal" },
  { name: "VGC team generation", group: "Projects", lines: [2, 3], built: true, note: "A search for Pokémon teams that are strong and different from each other. Engine built; search results still to come.", href: "/projects/vgc-team-generation" },
  { name: "Ballroom style finder", group: "Projects", lines: [0, 4, 5], built: true, note: "Listens to 30 seconds of a song and names the ballroom dances it fits.", href: "/projects/ballroom" },
  { name: "Tutoring assistant", group: "Exploring", lines: [0, 3, 6], built: false, note: "An idea: a tutor that notices how students see themselves as learners. Nothing built yet.", href: "/explorations#learner-identity" },
  { name: "Football tactics engine", group: "Exploring", lines: [0, 5], built: false, note: "An idea: learn how a team's shape changes through a match, and show it the way an analyst would use it.", href: "/explorations#tactics" },
  { name: "Dance biomechanics", group: "Exploring", lines: [0, 1, 5], built: false, note: "An idea: pose estimation on ballroom video, as feedback a dancer could practise with.", href: "/explorations#biomechanics" },
  { name: "Teaching", group: "Beyond the code", lines: [1, 6], built: true, note: "3,000+ math and programming lessons at Juni Learning since 2020.", href: "/about#experience" },
  { name: "Composing & arranging", group: "Beyond the code", lines: [4, 5], built: true, note: "Piano, voice, and writing music, including a showdance piece for a professional couple.", href: "/beyond#music" },
  { name: "Ballroom dancing", group: "Beyond the code", lines: [4, 5, 6], built: true, note: "Competing, and running rehearsals for BYU's Ballroom Showcase Company.", href: "/beyond#dance" },
];
