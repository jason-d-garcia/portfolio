/*
 * People who changed how Jason thinks, shown on /about. Each entry carries a quote that stuck and the story of why.
 * Quotes are checked against the source named in `source`. Add entries here; the section grows to fit.
 */
export type Influence = {
  name: string;
  years?: string;
  field: string;
  quote: string;
  source: string;
  why: string;
  link?: { href: string; label: string };
};

export const influences: Influence[] = [
  {
    name: "Karl Popper",
    years: "1902–1994",
    field: "Philosophy of science",
    quote: "The criterion of the scientific status of a theory is its falsifiability, or refutability, or testability.",
    source: "Conjectures and Refutations (1963)",
    why: "My first class as a graduate student, Theory of Predictive Modeling, began with the problem of induction instead of a model. We read Deutsch, who argues for science done well, and through him I met Popper's idea: you cannot prove a theory by piling up observations. You propose one and then try to break it. The class asked the same thing of models: when can we be sure one has captured something about the world? I have tried to work that way since.",
    link: { href: "/writing/testing-whats-true", label: "Testing what's true" },
  },
];
