/*
 * Music on /beyond. `works` are real pieces; a recording or score appears only when `src` is filled in.
 * To add one: drop the file in public/music/ and set src (audio: .mp3/.m4a, score: .pdf, video: a URL).
 */
export type Work = {
  title: string;
  kind: string;
  note: string;
  media?: { type: "audio" | "score" | "video"; src: string };
};

export const works: Work[] = [
  {
    title: "Showdance music for Yegor and Tatiana Novikov",
    kind: "Composition",
    note: "Written for a world-ranked professional Smooth couple, who performed it at the Blackpool Dance Festival in 2025.",
  },
  {
    title: "A cappella arrangement",
    kind: "Arrangement",
    note: "Recorded and released as a music video.",
  },
  {
    title: "Piano transcription",
    kind: "Transcription",
    note: "Published, with 20+ copies sold.",
  },
];

export const musicBackground = [
  "Classical piano to performance-program level. I came close to majoring in piano performance, and I've taught piano.",
  "Years of voice study. I sang in BYU Men's Chorus, won a voice competition, and served as VP of Finance for the A Cappella Club.",
  "Composing and arranging, mostly for voices and for dancers.",
  "Classical guitar, and two years as a temple organist.",
];
