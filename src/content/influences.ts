/*
 * The portrait hall on /about: people who changed how Jason thinks. Each portrait opens a quote that captures why,
 * and the story behind it. Quotes from books are checked against the source named in `source`.
 * `emblem` picks the drawing inside the frame (see PortraitHall). Add entries here; the hall grows to fit.
 */
export type Emblem = "swan" | "turn" | "book" | "hours";

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
  {
    id: "nelson",
    name: "Russell M. Nelson",
    role: "President of The Church of Jesus Christ of Latter-day Saints",
    years: "1924–2025",
    emblem: "book",
    emblemNote: "An open book, and the place you have read up to.",
    quote: "Education is the difference between wishing you could help other people and being able to help them.",
    source: "Devotional for young adults, September 2013",
    story: [
      "I grew up in a home where I often felt I had to be perfect to be loved. My junior year of high school was one of the hardest times in my life. The challenges of my home life began to spill over into my school life, and my grades started to slip. During this period, my faith became a lifeline for me, and I started to develop a desire to one day give back and help other people who stood in need.",
      "Around this time, President Nelson became the prophet of The Church of Jesus Christ of Latter-day Saints. I was trying to read and listen to everything I could of what he had taught, and I came across this line, which really resonated with me. All growing up, teachers had described me as \"gifted but lazy\" and told me of all the things I could do if I only applied myself more. This line tied those gifts to a greater stewardship. I determined that I would get as much education as I could, trusting that it would make me more capable of helping others, and for the first time in my life, I tried to match my effort to the gifts I had been given. I have tried to do that ever since.",
      "I have learned as much as I can: languages, instruments, mathematics, dance. Through my education, I have come to believe that I can only help others do what I have learned to do myself. I have also learned that people who are in need of help usually need more than knowledge. They need somebody who has walked the path, who can offer them hope that they can too, and who can walk that path with them.",
    ],
  },
  {
    id: "christensen",
    name: "Clayton M. Christensen",
    role: "Professor, Harvard Business School",
    years: "1952–2020",
    emblem: "hours",
    emblemNote: "A working day: the eight or ten hours people give you.",
    quote: "If you want to help other people, be a manager. If done well, management is among the most noble of professions.",
    source: "How Will You Measure Your Life? (2012)",
    story: [
      "I read How Will You Measure Your Life? during my first year at BYU, at a time when I was making pivotal decisions. Before high school I thought I would be a piano performance major. After my mission I started in applied physics, and quickly learned that physics was interesting to me but none of the careers were. I had interests in just about every subject under the sun and couldn't decide. All I knew was that I wanted to help people.",
      "And here was Clayton Christensen saying that management is one of the most noble professions, because your day is spent helping people to learn and grow. That idea helped me see a different path. Leaders have a powerful opportunity to shape the lives of the people they lead, and I think that is their responsibility. Being a good leader is not just about maximizing shareholder value or developing new products. That is part of it, but it is far from the only thing.",
      "The world has changed so much since I was a freshman that it is hard to say exactly what my future will look like. I could see myself doing many things, including some I didn't know existed back then. The thing that hasn't changed is that I want to help people.",
    ],
  },
];
