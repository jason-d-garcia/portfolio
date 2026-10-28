import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research",
  description: "A paper in preparation on quality-diversity search for Pokémon VGC teams, and a research direction on learner identity in tutoring.",
};

// Set once the paper is posted.
const arxivUrl = "";

export default function ResearchPage() {
  return (
    <article className="pt-16 sm:pt-24">
      <h1 className="px-4 text-[clamp(3rem,1.6rem+7vw,8.5rem)] leading-[0.92] tracking-[-0.03em] sm:px-8">Research</h1>

      <section className="px-4 py-20 sm:px-8 sm:py-28">
        <div className="max-w-[62ch] space-y-5">
          <p className="text-lg text-accent-text">Paper in preparation, with Bryce Martin</p>
          <h2 className="text-[clamp(2rem,1.3rem+3.2vw,4rem)] leading-[1] tracking-[-0.02em]">Quality-diversity search for VGC teams</h2>
          <p>
            We use MAP-Elites to search for Pokémon doubles teams that are both strong and different from each other. Each team is
            scored by simulated battles against the teams players actually use, weighted by how often they appear. The battle
            simulator and a pilot evaluation are built; the search has not been run at scale, so there are no results yet.
          </p>
          <p className="text-muted">
            {arxivUrl ? (
              <a href={arxivUrl} className="underline underline-offset-4 hover:text-ink">Read the paper on arXiv ↗</a>
            ) : (
              "The arXiv link will be posted here once the paper is out."
            )}
          </p>
          <p>
            <Link href="/projects/vgc-team-generation" className="underline underline-offset-4 hover:text-accent-text">
              Read the project page
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-field-2 px-4 py-20 text-white sm:px-8 sm:py-28">
        <div className="max-w-[62ch] space-y-5 sm:ml-auto sm:mr-[8%]">
          <p className="text-lg">Concept. Nothing is built or tested yet.</p>
          <h2 className="text-[clamp(2rem,1.3rem+3.2vw,4rem)] leading-[1] tracking-[-0.02em]">Learner identity in tutoring</h2>
          <p>
            How students see themselves as learners shapes what they are willing to try. The question I want to study is whether a
            tutor can notice that during a session, and whether responding to it changes what a student attempts. This is a
            direction for future work, not a finished project.
          </p>
          <p>
            <Link href="/projects/tutoring-assistant" className="underline underline-offset-4 hover:text-field-4">
              Read the concept note
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
