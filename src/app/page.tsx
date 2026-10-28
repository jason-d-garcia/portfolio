import { ProjectList } from "@/components/ProjectList";
import { profile } from "@/content/profile";

function HeroLines({ hidden = false }: { hidden?: boolean }) {
  return (
    <p
      aria-hidden={hidden || undefined}
      className="text-[14vw] leading-[0.9] font-normal tracking-[-0.03em] sm:text-[clamp(4rem,10.5vw,10rem)]"
    >
      <span className="line-mask"><span>Applied ML</span></span>
      <span className="line-mask"><span>for learning</span></span>
    </p>
  );
}

export default function Home() {
  return (
    <>
      {/* Two fields meet at the seam; the headline is drawn twice and each copy is clipped to its field. */}
      <section className="relative h-[calc(100svh-4rem)] min-h-[34rem] [--seam:46%] sm:[--seam:50%]">
        <div className="absolute inset-x-0 bottom-0 top-[var(--seam)] bg-field-4" />
        <h1 className="sr-only">Jason Garcia: applied ML for learning</h1>
        {[false, true].map((lower) => (
          <div
            key={String(lower)}
            aria-hidden
            className={`absolute inset-0 px-4 sm:px-8 ${lower ? "text-field-4-ink" : "text-[var(--hero-top-ink)]"}`}
            style={{ clipPath: lower ? "inset(var(--seam) 0 0 0)" : "inset(0 0 calc(100% - var(--seam)) 0)" }}
          >
            {/* Line two's middle sits on the seam: two lines of 0.9em, x-height of the second sits about 1.6em down. */}
            <div className="absolute inset-x-4 top-[var(--seam)] -translate-y-[1.6em] text-[14vw] sm:inset-x-8 sm:text-[clamp(4rem,10.5vw,10rem)]">
              <HeroLines hidden />
            </div>
          </div>
        ))}
        <div className="fade-up absolute inset-x-4 bottom-8 flex flex-col gap-6 sm:inset-x-8 sm:bottom-10 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl text-[1.0625rem] leading-snug text-field-4-ink sm:text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)]">
            I&rsquo;m Jason Garcia, an MS Computer Science student at BYU. {profile.headline}
          </p>
          <a
            href="#work"
            className="inline-flex h-12 shrink-0 items-center self-start bg-field-4-ink px-6 text-lg text-field-4 transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:self-auto"
          >
            See the projects
          </a>
        </div>
      </section>

      <section id="work" className="scroll-mt-4 px-4 py-28 sm:px-8 sm:py-40">
        <div data-reveal className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-[clamp(2rem,1.3rem+3.2vw,4rem)] leading-none tracking-[-0.02em]">Five projects</h2>
          <p className="max-w-sm text-muted">Two shipped, two in progress and one idea, each labelled as what it is.</p>
        </div>
        <div className="mt-14 sm:mt-20">
          <ProjectList />
        </div>
      </section>

      <section className="bg-field-2 px-4 py-28 text-white sm:px-8 sm:py-40">
        <p
          data-reveal
          className="max-w-6xl text-[1.25rem] leading-[1.3] sm:columns-2 sm:gap-10 sm:text-[clamp(1.375rem,0.9rem+1.2vw,2rem)] sm:leading-[1.22]"
        >
          <span>
            <strong className="font-medium">Jason Garcia.</strong> I&rsquo;m working toward an{" "}
            <mark className="mark bg-field-4 text-field-4-ink">MS in Computer Science at BYU</mark>, finishing in December 2027, after a
            BS in Mathematics. Since 2020 I&rsquo;ve taught{" "}
            <mark className="mark bg-field-4 text-field-4-ink">3,000+ math and programming lessons</mark> at Juni Learning, where I also
            wrote the on-demand Minecraft digital-logic course and trained new instructors. Teaching is where my interest in machine
            learning comes from: every student deserves a fair chance to learn, and good tools can help. Today I&rsquo;m a{" "}
            <mark className="mark bg-field-1 text-white">data science intern</mark> at The Church of Jesus Christ of Latter-day Saints,
            building analytics for Meetinghouse &amp; Facilities. My projects cover{" "}
            <mark className="mark bg-field-4 text-field-4-ink">NLP, audio models, uncertainty and search</mark>, and I measure each one
            before I call it done. I&rsquo;m looking for a{" "}
            <mark className="mark bg-field-1 text-white">Summer 2027 internship</mark> in applied ML, especially on teams building for
            learners.{" "}
            <a href="#contact" className="mark mt-6 inline-block bg-field-4 text-field-4-ink hover:bg-white sm:mt-0">
              Get in touch.
            </a>
          </span>
        </p>
      </section>

      <section id="experience" className="scroll-mt-4 px-4 py-28 sm:px-8 sm:py-40">
        <div className="sm:ml-[22%] sm:max-w-[40rem]">
          <h2 data-reveal className="text-[clamp(2rem,1.3rem+3.2vw,4rem)] leading-none tracking-[-0.02em]">
            Experience
          </h2>
          <ul className="mt-10 space-y-6">
            {profile.experience.map((e) => (
              <li key={e.org} data-reveal>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                  <p className="text-lg">
                    <span className="font-medium">{e.org}</span>
                    <span className="text-muted"> · {e.role}</span>
                  </p>
                  {e.when && <p className="shrink-0 text-muted tabular-nums">{e.when}</p>}
                </div>
                <p className="mt-1">{e.detail}</p>
              </li>
            ))}
          </ul>

          <h2 data-reveal className="mt-24 text-[clamp(2rem,1.3rem+3.2vw,4rem)] leading-none tracking-[-0.02em]">
            Education
          </h2>
          <ul className="mt-10 space-y-6">
            {profile.education.map((e) => (
              <li key={e.degree} data-reveal className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                <p className="text-lg">
                  <span className="font-medium">{e.degree}</span>
                  <span className="text-muted"> · {e.school}</span>
                </p>
                <p className="shrink-0 text-muted tabular-nums">{e.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
