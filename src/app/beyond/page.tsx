import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beyond work",
  description: "Dance, music, teaching, service, languages and a few other things Jason Garcia does outside of ML.",
};

const groups: { name: string; items: string[] }[] = [
  {
    name: "Dance",
    items: [
      "Competitive ballroom dancer since college; national finalist.",
      "ISTD Licentiate in International Latin.",
      "Rehearsal assistant for BYU Ballroom Showcase Company, running Standard rehearsals.",
      "Training with a professional coach since 2024.",
    ],
  },
  {
    name: "Music",
    items: [
      "Classical piano at performance-program level. I've also taught piano.",
      "Wrote showdance music for a world-ranked professional Smooth couple.",
      "Arranged an a cappella piece that was recorded as a music video.",
      "Published a piano transcription; 20+ copies sold.",
      "Sang in BYU Men's Chorus and served as VP of Finance for the A Cappella Club.",
      "Won a voice competition. I also play classical guitar.",
    ],
  },
  {
    name: "Teaching",
    items: [
      "Senior instructor at Juni Learning since 2020, and a trainer on its Instructor Success Team.",
      "Wrote Juni's on-demand Minecraft digital-logic course, the third most popular on the platform.",
    ],
  },
  {
    name: "Service",
    items: [
      "Stake clerk: led a multi-stake boundary proposal affecting about 5,000 members and trained 20+ ward clerks.",
      "High council: organized temple service projects with 50+ volunteers; financial auditor.",
      "Sunday School president.",
      "Temple organist for two years.",
    ],
  },
  {
    name: "Languages",
    items: ["Spanish and Italian (B2), German and Russian (B1), some Portuguese and French."],
  },
  {
    name: "Other",
    items: ["Varsity soccer.", "Played the lead in my high school musical.", "Solve a Rubik's cube in under 20 seconds on average."],
  },
];

export default function BeyondPage() {
  return (
    <article className="px-4 pt-16 pb-28 sm:px-8 sm:pt-24">
      <h1 className="text-[clamp(3rem,1.6rem+7vw,8.5rem)] leading-[0.92] tracking-[-0.03em]">Beyond work</h1>
      <p className="mt-6 max-w-xl text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)] leading-snug">
        What I do when I&rsquo;m not training models.
      </p>
      <div className="mt-16 space-y-14 sm:mt-24 sm:space-y-20">
        {groups.map((g) => (
          <section key={g.name} data-reveal className="grid gap-4 sm:grid-cols-[14rem_1fr] sm:gap-10">
            <h2 className="text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-tight tracking-[-0.02em]">{g.name}</h2>
            <ul className="max-w-[62ch] space-y-3">
              {g.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
