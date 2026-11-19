/*
 * The portrait hall on /about: people who changed how Jason thinks. Each portrait opens a quote that captures why,
 * and the story behind it. Quotes from books are checked against the source named in `source`.
 * `emblem` picks the drawing inside the frame (see PortraitHall). Add entries here; the hall grows to fit.
 */
export type Emblem = "swan" | "turn";

export type Influence = {
  id: string;
  name: string;
  // Who they are, for visitors who won't recognise the name.
  role: string;
  years?: string;
  emblem: Emblem;
  // What the drawing is, for the caption and for screen readers.
  emblemNote: string;
  quote: string;
  source: string;
  story: string[];
  link?: { href: string; label: string };
};

export const influences: Influence[] = [
  {
    id: "popper",
    name: "Karl Popper",
    role: "Philosopher of science",
    years: "1902–1994",
    emblem: "swan",
    emblemNote: "A black swan: one is enough to refute \"all swans are white\".",
    quote: "The criterion of the scientific status of a theory is its falsifiability, or refutability, or testability.",
    source: "Conjectures and Refutations (1963)",
    story: [
      "My first class as a graduate student, Theory of Predictive Modeling, began with the problem of induction instead of a model. The textbook was David Deutsch's The Beginning of Infinity, which argues for science done well, and through it I met Popper's idea: you cannot prove a theory by piling up observations. You propose one and then try to break it.",
      "The class asked the same thing of models. When can we be sure one has captured something about the world, and not only something about our data? I have tried to work that way since.",
    ],
    link: { href: "/writing/testing-whats-true", label: "Testing what's true" },
  },
  {
    id: "andres-end",
    name: "Andres End",
    role: "My ballroom coach",
    emblem: "turn",
    emblemNote: "Moving past your partner. The sway follows.",
    quote: "Sometimes you just have to make stuff up.",
    source: "In a lesson, November 2026",
    story: [
      "Andres told our top technique class at BYU that we think about dancing a step in an entirely different way than he does. We try to sway. He just moves past his partner, and sway is what happens when you do. It is a consequence, not a cause.",
      "He is why I believe a master's model is simpler than a beginner's and holds more truth, and why I think good judgment is a trained sense of what a structure will allow. He makes things up in lessons, and they work, because his model of dancing is that good.",
    ],
    link: { href: "/writing/making-things-up", label: "Better at making things up" },
  },
];
