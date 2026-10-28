// Single source of truth for personal details. Keep every claim here verifiable.
export const profile = {
  name: "Jason Garcia",
  headline: "I build human-centered machine learning and ship it as things people can use.",
  summary:
    "MS Computer Science student at BYU and longtime math and programming teacher. I work on applied ML (NLP, uncertainty quantification, computer vision) and care most about technology that expands opportunity for learners. Looking for Summer 2027 ML/AI internships, especially in education.",
  links: {
    github: "https://github.com/jason-d-garcia",
    linkedin: "https://www.linkedin.com/in/jasondgarcia1/",
    // TODO: add once confirmed
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
      org: "The Church of Jesus Christ of Latter-day Saints",
      role: "Data Science Intern",
      when: "Sep 2026 – now",
      detail: "Analytics and Power BI reporting for Meetinghouse & Facilities, since September 2026.",
    },
    {
      org: "Deloitte",
      role: "Discovery 2 Intern",
      when: "",
      detail: "Python automation, analytics pipelines, and AWS Lambda services.",
    },
    {
      org: "Bain & Company",
      role: "BEL Intern",
      when: "",
      detail: "Regression modeling for education-sector consulting work.",
    },
    {
      org: "Juni Learning",
      role: "Senior Instructor",
      when: "2020 – now",
      detail:
        "Taught 3,000+ mathematics and programming lessons. Wrote the on-demand Minecraft digital logic course, the platform's third most popular, and trained new instructors on the Instructor Success Team.",
    },
  ],
  skills: ["Python", "PyTorch", "BERT / NLP", "XGBoost", "SHAP", "Clustering", "SQL", "AWS", "TypeScript", "Next.js"],
};
