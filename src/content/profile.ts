// Single source of truth for personal details. Keep every claim here verifiable.
export const profile = {
  name: "Jason Garcia",
  headline: "I build machine learning systems and ship them as things people can use.",
  summary:
    "MS Computer Science student at BYU focused on applied ML, NLP, and research engineering. Looking for Summer 2027 ML/AI engineering internships.",
  links: {
    github: "https://github.com/jason-d-garcia",
    // TODO: add once confirmed
    linkedin: "",
    email: "",
    resume: "",
  },
  education: [
    {
      school: "Brigham Young University",
      degree: "M.S. Computer Science",
      detail: "4.0 GPA · expected Dec 2027",
    },
    {
      school: "Brigham Young University",
      degree: "B.S. Mathematics",
      detail: "3.84 GPA",
    },
  ],
  experience: [
    {
      org: "Deloitte",
      role: "", // TODO: confirm title
      detail: "Python automation, analytics pipelines, and AWS Lambda services.",
    },
    {
      org: "Bain & Company",
      role: "", // TODO: confirm title
      detail: "Regression modeling for education-sector consulting work.",
    },
    {
      org: "Teaching",
      role: "Math & programming instructor",
      detail: "Taught 3,000+ mathematics and programming lessons.",
    },
  ],
  skills: ["Python", "PyTorch", "BERT / NLP", "XGBoost", "SHAP", "Clustering", "SQL", "AWS", "TypeScript", "Next.js"],
};
