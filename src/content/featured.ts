import { getProject } from "./projects";

// Home page order. Projects without a page yet are listed without a link.
type Featured = { slug: string; name: string; tagline: string; status: string };

const entries: Featured[] = [
  { slug: "moodify", name: "senti", tagline: "", status: "Live demo" },
  {
    slug: "vgc-team-generation",
    name: "VGC team generation",
    tagline: "Quality-diversity search for Pokémon doubles teams that are strong and different from each other.",
    status: "In progress · paper in preparation",
  },
  {
    slug: "tiktok-conformal",
    name: "TikTok forecasting",
    tagline: "Forecasting a video's views with conformal intervals that say how sure the model is.",
    status: "In progress · Dec 2026",
  },
  { slug: "ballroom", name: "Ballroom style finder", tagline: "", status: "Shipped" },
  {
    slug: "tutoring-assistant",
    name: "Tutoring assistant",
    tagline: "An idea for a tutor that pays attention to how students see themselves as learners.",
    status: "Concept",
  },
];

export const featured = entries.map((e) => {
  const project = getProject(e.slug);
  return { ...e, tagline: e.tagline || project?.tagline || "", href: project ? `/projects/${e.slug}` : null };
});
