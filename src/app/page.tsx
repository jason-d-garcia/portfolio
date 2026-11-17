import Link from "next/link";
import { ProjectFigure, projectHue } from "@/components/previews";
import { Score } from "@/components/Score";
import { SectionHead } from "@/components/SectionHead";
import { StatusBadge } from "@/components/StatusBadge";
import { explorations } from "@/content/explorations";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";

// Short teasers for the sections that have their own page. The full text lives there.
const teasers = [
  {
    title: "Current explorations",
    body: `${explorations.length} ideas and unfinished experiments, from a VGC paper in preparation to a tutor that notices how students see themselves.`,
    href: "/explorations",
    link: "All explorations",
  },
  {
    title: "Beyond the code",
    body: "Music, ballroom, mathematics and languages, each one a way of thinking.",
    href: "/beyond",
    link: "Beyond the code",
  },
  {
    title: "What matters",
    body: "Technology is a means. The point is who it helps: service, stewardship, honesty and learning.",
    href: "/about#values",
    link: "What matters",
  },
  {
    title: "About",
    body: "MS Computer Science at BYU (Dec 2027), data science intern, teaching since 2020. Looking for a Summer 2027 ML internship.",
    href: "/about",
    link: "More about me",
  },
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

      <section id="work" className="frame scroll-mt-6 pt-14 sm:pt-20">
        <SectionHead index="01" title="Selected work">
          <p className="max-w-[46ch] font-display text-[clamp(1.375rem,1.15rem+0.9vw,1.875rem)] leading-[1.1] tracking-[-0.02em]">
            Four projects, each with the figure, the number and the catch.
          </p>
        </SectionHead>
        <ol className="mt-8 grid gap-x-8 gap-y-12 sm:mt-10 sm:grid-cols-2 sm:gap-y-14">
          {featuredProjects.map((p, i) => (
            <li key={p.slug} data-reveal style={{ "--hue": projectHue(p.slug) } as React.CSSProperties}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <ProjectFigure slug={p.slug} compact />
                <p className="meta mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-hue">{String(i + 1).padStart(2, "0")}</span>
                  <StatusBadge project={p} />
                </p>
                <h3 className="mt-2 font-display text-[clamp(1.625rem,1.3rem+1.2vw,2.25rem)] leading-none font-medium tracking-[-0.03em] group-hover:text-accent-text">
                  {p.name}
                </h3>
                <p className="mt-3 text-[1.0625rem] leading-snug">{p.tagline}</p>
                {p.result && <p className="mt-2 text-[0.9375rem] leading-snug text-muted">{p.result}</p>}
                <p className="mt-3 text-[0.9375rem]">
                  <span className="link">Read the write-up</span> <span aria-hidden className={`inline-block ${arrow}`}>→</span>
                </p>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-10">
          <Link href="/projects" className="link">All projects →</Link>
        </p>
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

      <section aria-label="More about me" className="frame py-16 sm:py-24">
        <ul className="grid gap-x-8 gap-y-8 border-t border-ink pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {teasers.map((t, i) => (
            <li key={t.title} data-reveal>
              <Link href={t.href} className="group block">
                <span className="meta block">
                  <span className="text-accent-text">{String(i + 2).padStart(2, "0")}</span> / {t.title}
                </span>
                <span className="mt-3 block text-[0.9375rem] leading-snug text-muted">{t.body}</span>
                <span className="mt-3 block text-[0.9375rem]">
                  <span className="link">{t.link}</span> <span aria-hidden className={`inline-block ${arrow}`}>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
