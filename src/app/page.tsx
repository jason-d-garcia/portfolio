import Link from "next/link";
import { ProjectList } from "@/components/ProjectList";
import { ProofStrip } from "@/components/ProofStrip";
import { profile } from "@/content/profile";
import { hasResume } from "@/lib/site";

const h2 = "text-[clamp(2rem,1.3rem+3.2vw,4rem)] leading-none tracking-[-0.02em]";

export default function Home() {
  return (
    <>
      {/* One field, one colour: the headline sits whole on the yellow, the intro and the links at its foot. */}
      <section className="flex flex-col justify-between bg-field-4 px-4 pt-14 pb-10 text-field-4-ink sm:min-h-[calc(100svh-4rem)] sm:px-8 sm:pt-20 sm:pb-12">
        <h1 className="sr-only">Jason Garcia: applied ML for learning</h1>
        <p aria-hidden className="text-[15vw] leading-[0.9] tracking-[-0.03em] sm:text-[clamp(4rem,10.5vw,10rem)]">
          <span className="line-mask"><span>Applied ML</span></span>
          <span className="line-mask"><span>for learning</span></span>
        </p>
        <div className="fade-up mt-12 flex flex-col gap-6 sm:mt-16 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl text-[1.0625rem] leading-snug sm:text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)]">
            I&rsquo;m Jason Garcia, an MS Computer Science student at BYU. {profile.headline}
          </p>
          <div className="flex shrink-0 flex-wrap gap-3 font-sans">
            <a
              href="#work"
              className="inline-flex h-12 items-center bg-field-4-ink px-6 text-base text-field-4 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              See the projects
            </a>
            {hasResume && (
              <Link href="/resume" className="inline-flex h-12 items-center border border-field-4-ink/40 px-6 text-base hover:border-field-4-ink">
                Resume
              </Link>
            )}
            {profile.links.email && (
              <a href={`mailto:${profile.links.email}`} className="inline-flex h-12 items-center border border-field-4-ink/40 px-6 text-base hover:border-field-4-ink">
                Email
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-8 sm:py-16">
        <ProofStrip />
      </section>

      <section id="work" className="scroll-mt-4 px-4 pt-10 pb-24 sm:px-8 sm:pt-16 sm:pb-32">
        <div data-reveal className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className={h2}>Projects</h2>
          <p className="max-w-sm font-sans text-sm text-muted sm:text-base">
            Two shipped, two in progress and one idea, each labelled as what it is.{" "}
            <Link href="/projects" className="text-ink underline underline-offset-4 hover:text-accent-text">
              Open the notebook →
            </Link>
          </p>
        </div>
        <div className="mt-10 sm:mt-14">
          <ProjectList />
        </div>
      </section>

      <section className="bg-field-2 px-4 py-24 text-white sm:px-8 sm:py-32">
        <p
          data-reveal
          className="max-w-[65ch] text-[1.25rem] leading-[1.3] sm:text-[clamp(1.375rem,0.9rem+1.1vw,1.875rem)] sm:leading-[1.25]"
        >
          <span>
            <strong className="font-medium">Jason Garcia.</strong> I&rsquo;m working toward an{" "}
            <mark className="mark bg-field-4 text-field-4-ink">MS in Computer Science at BYU</mark>, finishing in December 2027, after a
            BS in Mathematics. Since 2020 I&rsquo;ve taught 3,000+ math and programming lessons at Juni Learning, where I also wrote the
            on-demand Minecraft digital-logic course and trained new instructors. Teaching is where my interest in machine learning
            comes from: every student deserves a fair chance to learn, and good tools can help. Today I&rsquo;m a data science intern at
            The Church of Jesus Christ of Latter-day Saints, building analytics for Meetinghouse &amp; Facilities. My projects cover
            NLP, audio models, uncertainty and search, and I measure each one before I call it done. I&rsquo;m looking for a{" "}
            <mark className="mark bg-field-4 text-field-4-ink">Summer 2027 internship</mark> in applied ML, especially on teams building
            for learners.{" "}
            <a href="#contact" className="underline underline-offset-4 hover:text-field-4">
              Get in touch.
            </a>
          </span>
        </p>
      </section>

      <section id="experience" className="scroll-mt-4 px-4 py-24 sm:px-8 sm:py-32">
        <div className="sm:ml-[22%] sm:max-w-[40rem]">
          <h2 data-reveal className={h2}>
            Experience
          </h2>
          <ul className="mt-10 space-y-7">
            {profile.experience.map((e) => (
              <li key={e.org} data-reveal>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                  <p className="text-lg">
                    <span className="font-medium">{e.org}</span>
                    <span className="text-muted"> · {e.role}</span>
                  </p>
                  {e.when && <p className="shrink-0 font-sans text-sm text-muted tabular-nums sm:pt-1">{e.when}</p>}
                </div>
                <p className="mt-1">{e.detail}</p>
              </li>
            ))}
          </ul>

          <h2 data-reveal className={`mt-24 ${h2}`}>
            Education
          </h2>
          <ul className="mt-10 space-y-6">
            {profile.education.map((e) => (
              <li key={e.degree} data-reveal className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                <p className="text-lg">
                  <span className="font-medium">{e.degree}</span>
                  <span className="text-muted"> · {e.school}</span>
                </p>
                <p className="shrink-0 font-sans text-sm text-muted tabular-nums sm:pt-1">{e.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
