/*
 * Ideas and unfinished experiments. The stage label is the honest part: "Idea" means nothing is built.
 * Same rule as the projects: no number without a source, and no result that doesn't exist yet.
 */
export type Exploration = {
  id: string;
  title: string;
  question: string;
  stage: string;
  fields: string[];
  body: string[];
  link?: { href: string; label: string };
};

export const explorations: Exploration[] = [
  {
    id: "vgc-paper",
    title: "Quality-diversity search for VGC teams",
    question: "Can a search return many strong teams that play differently, not one winner?",
    stage: "Paper in preparation",
    fields: ["Evolutionary search", "Simulation", "Games"],
    body: [
      "With Bryce Martin, I'm using MAP-Elites to search for Pokémon doubles teams that are both strong and different from each other. Each team is scored by simulated battles against the teams players actually use, weighted by how often they appear.",
      "The Rust battle engine is built and validated against Pokémon Showdown (99.5-100% of outcomes match, at 30-45x the speed). The search has not run at scale, so there are no archive results yet.",
    ],
    link: { href: "/projects/vgc-team-generation", label: "Project page" },
  },
  {
    id: "learner-identity",
    title: "Learner identity in tutoring",
    question: "Can a tutor notice how a student sees themself as a learner, and should it respond?",
    stage: "Idea · nothing built",
    fields: ["Education", "LLMs", "Learning science"],
    body: [
      "How students see themselves as learners shapes what they are willing to try. Most tutoring software tracks which answers a student gets right, not whether they believe they can learn the material. The idea comes out of six years of teaching.",
      "It is a direction, not a project. The first step is reading the research on learner identity, then a small prototype.",
    ],
    link: { href: "/projects/tutoring-assistant", label: "Concept note" },
  },
  {
    id: "early-metrics",
    title: "Forecasting from a post's first hours",
    question: "How early can you tell that a video is going to break out?",
    stage: "Next experiment · needs data access",
    fields: ["Forecasting", "Survival analysis"],
    body: [
      "In the TikTok project, a hazard-gate model on early metrics was the most workable approach I tried. Testing it properly needs metrics pulled at fixed times after posting, and the public datasets have one snapshot per post. The next step is research data access.",
    ],
    link: { href: "/projects/tiktok-conformal", label: "TikTok forecasting" },
  },
  {
    id: "engram",
    title: "Editing what a network knows",
    question: "Can you remove one concept from a model without disturbing the rest?",
    stage: "Earlier results · paused",
    fields: ["Interpretability", "Sparse autoencoders", "Linear algebra"],
    body: [
      "A model-editing method that builds its edit from sparse-autoencoder dictionary atoms, which avoids the numerical failures that covariance estimates hit on sparse activations. On CIFAR-100 with a ResNet-56, four-dimensional subspaces reached 40.6x concept-suppression selectivity, against 16.7x for the one-dimensional baseline.",
      "Those are small-model results. Nothing has been run at transformer scale, and the work is paused.",
    ],
  },
  {
    id: "tactics",
    title: "A tactics engine for football",
    question: "Can a model learn how a team's shape changes through a match, in a form an analyst would use?",
    stage: "Idea · nothing built",
    fields: ["Sports analytics", "Representation learning"],
    body: [
      "A tactical analysis tool for football, starting with Chelsea matches. I want it to show what a team's structure is doing, not only where the ball went. It would need tracking or event data, a learned representation of team shape, and an interface built for the questions analysts ask. None of it exists yet.",
    ],
  },
  {
    id: "biomechanics",
    title: "Ballroom biomechanics",
    question: "Could pose estimation give a dancer feedback worth practising with?",
    stage: "Idea · nothing built",
    fields: ["Computer vision", "Motion analysis", "Dance"],
    body: [
      "The follow-on to the ballroom style finder: pose estimation on dance video, turned into feedback a dancer or coach could use. I know the dancing side well. The vision side is unstarted.",
    ],
    link: { href: "/projects/ballroom", label: "Ballroom style finder" },
  },
];

export const openQuestions = [
  "How do you tell someone how sure a model is, in a way they can act on?",
  "What makes a search return interesting answers, not only good ones?",
  "Where does structure end and expression begin in a piece of music?",
  "What does a good teacher notice that software doesn't?",
];
