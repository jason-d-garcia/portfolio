import Link from "next/link";
import { ProjectFigure, projectHue } from "@/components/previews";
import { Score } from "@/components/Score";
import { SectionHead } from "@/components/SectionHead";
import { StatusBadge } from "@/components/StatusBadge";
import { explorations } from "@/content/explorations";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { values, valuesLead } from "@/content/values";

const pursuits = [
  { name: "Music", body: "Piano, voice, composing and arranging. I came close to majoring in piano performance.", href: "/beyond#music" },
  { name: "Ballroom", body: "Competitive dancing, and running rehearsals for a showcase company.", href: "/beyond#dance" },
  { name: "Mathematics", body: "My first degree. I like knowing why an algorithm works, not only how to call it.", href: "/beyond#interests" },
  { name: "Languages", body: "Spanish and Italian, some German and Russian, and an interest in how languages work.", href: "/beyond#interests" },
];

const arrow = "transition-transform duration-300 group-hover:translate-x-1";

export default function Home() {
  return (
    <>
      <section className="frame pt-10 sm:pt-14">
        <p className="meta fade-up" style={{ animationDelay: "0ms" }}>
          {profile.name} <span className="text-rule">—</span> AI / ML · Mathematics · Creative technology
        </p>
        <h1 className="mt-6 max-w-[16ch] text-[clamp(2.5rem,1.2rem+5.6vw,5.75rem)] leading-[0.95] tracking-[-0.035em] sm:mt-8">
          <span className="line-mask"><span>Exploring ideas,</span></span>
          <span className="line-mask"><span>building systems,</span></span>
          <span className="line-mask"><span>making <span className="voice text-accent-text">things that matter.</span></span></span>
        </h1>
        <div className="fade-up mt-8 grid gap-6 sm:mt-12 sm:grid-cols-12 sm:gap-8">
          <p className="max-w-[58ch] text-[clamp(1.0625rem,1rem+0.45vw,1.3125rem)] leading-snug sm:col-span-7 sm:col-start-4">
            I&rsquo;m an MS Computer Science student at BYU working in machine learning, optimization and interactive software.
            Lately that means a map of music you browse by feeling, forecasts that say how sure they are, and a search for
            Pokémon teams nobody has tried. I care most about tools that help people learn, create and do what they
            couldn&rsquo;t before.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 sm:col-span-7 sm:col-start-4">
            <li><a href="#work" className="link">Selected work ↓</a></li>
            <li><Link href="/about" className="link">About me</Link></li>
            <li><a href={profile.links.github} className="link">GitHub ↗</a></li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="score-title" className="frame pt-16 sm:pt-24">
        <div className="mb-8 grid gap-2 sm:grid-cols-12 sm:gap-8">
          <h2 id="score-title" className="meta sm:col-span-3">The work, as a score</h2>
          <p className="max-w-[60ch] text-[0.9375rem] leading-snug text-muted sm:col-span-9">
            Each line is a discipline. Each chord is something I&rsquo;ve built, am exploring, or do away from the keyboard,
            with a note on every line it touches. Hollow notes are ideas with nothing built yet. Pick a chord, and turn the
            sound on to hear it.
          </p>
        </div>
        <Score />
      </section>

      <section id="work" className="frame scroll-mt-6 pt-24 sm:pt-36">
        <SectionHead index="01" title="Selected work">
          <p className="max-w-[46ch] font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-[1.1] tracking-[-0.02em]">
            Four projects, each with the figure, the number and the catch.
          </p>
        </SectionHead>
        <ol className="mt-12 space-y-20 sm:mt-20 sm:space-y-32">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal style={{ "--hue": projectHue(p.slug) } as React.CSSProperties}>
              <Link href={`/projects/${p.slug}`} className="group grid items-end gap-6 sm:grid-cols-12 sm:gap-8">
                <ProjectFigure
                  slug={p.slug}
                  className={i % 2 ? "sm:order-2 sm:col-span-6 sm:col-start-7" : "sm:col-span-7"}
                />
                <div className={i % 2 ? "sm:order-1 sm:col-span-5 sm:row-start-1" : "sm:col-span-5"}>
                  <p className="meta flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-hue">{String(i + 1).padStart(2, "0")}</span>
                    <StatusBadge project={p} />
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] leading-none font-medium tracking-[-0.03em]">
                    {p.name}
                  </h3>
                  <p className="mt-4 text-[1.0625rem] leading-snug">{p.tagline}</p>
                  {p.result && <p className="mt-3 text-[0.9375rem] leading-snug text-muted">{p.result}</p>}
                  <p className="mt-5 text-[0.9375rem]">
                    <span className="link">Read the write-up</span> <span aria-hidden className={`inline-block ${arrow}`}>→</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="frame pt-24 sm:pt-36">
        <SectionHead index="02" title="Current explorations">
          <p className="max-w-[46ch] font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-[1.1] tracking-[-0.02em]">
            Ideas and unfinished experiments, labelled as what they are.
          </p>
        </SectionHead>
        <ul className="mt-10 sm:ml-[25%] sm:mt-14">
          {explorations.map((e) => (
            <li key={e.id} data-reveal className="border-b border-rule first:border-t">
              <Link href={`/explorations#${e.id}`} className="group grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                <span className="text-[1.125rem] leading-snug group-hover:text-accent-text">{e.question}</span>
                <span className="meta">{e.stage}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 sm:ml-[25%]">
          <Link href="/explorations" className="link">All explorations →</Link>
        </p>
      </section>

      <section className="frame pt-24 sm:pt-36">
        <SectionHead index="03" title="Beyond the code">
          <p className="max-w-[46ch] font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-[1.1] tracking-[-0.02em]">
            Music, dance, mathematics and languages, <span className="voice">each one a way of thinking.</span>
          </p>
        </SectionHead>
        <ul className="mt-10 grid gap-x-8 gap-y-8 sm:mt-14 sm:grid-cols-12">
          {pursuits.map((p, i) => (
            <li key={p.name} data-reveal className={`sm:col-span-3 ${i % 2 ? "sm:mt-10" : ""}`}>
              <Link href={p.href} className="group block border-t border-rule pt-3">
                <span className="block font-display text-2xl tracking-[-0.02em] group-hover:text-accent-text">{p.name}</span>
                <span className="mt-2 block text-[0.9375rem] leading-snug text-muted">{p.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24 bg-surface sm:mt-36">
        <div className="frame py-20 sm:py-28">
          <SectionHead index="04" title="What matters">
            <p data-reveal className="max-w-[30ch] font-display text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] leading-[1.08] tracking-[-0.025em]">
              Technology is a means. <span className="voice">The point is who it helps.</span>
            </p>
            <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-snug">{valuesLead}</p>
            <dl className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {values.map((v) => (
                <div key={v.name} data-reveal>
                  <dt className="meta text-ink">{v.name}</dt>
                  <dd className="mt-2 max-w-[44ch] text-[0.9375rem] leading-snug text-muted">{v.body}</dd>
                </div>
              ))}
            </dl>
          </SectionHead>
        </div>
      </section>

      <section className="frame py-24 sm:py-36">
        <SectionHead index="05" title="About">
          <p className="max-w-[60ch] text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-snug">
            I&rsquo;m finishing an MS in Computer Science at BYU in December 2027, after a BS in Mathematics. I&rsquo;ve taught
            math and programming at Juni Learning since 2020, and I&rsquo;m a data science intern at The Church of Jesus Christ
            of Latter-day Saints. I&rsquo;m looking for a Summer 2027 internship in applied ML, especially on teams building
            for learners.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/about" className="link">More about me →</Link></li>
            <li><Link href="/resume" className="link">Resume →</Link></li>
          </ul>
        </SectionHead>
      </section>
    </>
  );
}
