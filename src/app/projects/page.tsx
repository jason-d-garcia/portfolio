import type { Metadata } from "next";
import Link from "next/link";
import { ProjectFigure, projectHue } from "@/components/previews";
import { StatusBadge } from "@/components/StatusBadge";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Applied ML projects by Jason Garcia: what was built, what was measured, and what didn't work.",
};

const tools = [
  { href: "/vgc", label: "VGC team builder" },
  { href: "/creator-studio", label: "Creator studio: draft comparison" },
];

export default function ProjectsPage() {
  return (
    <section className="frame pt-14 pb-28 sm:pt-20">
      <p className="meta">Projects</p>
      <h1 className="mt-5 max-w-[16ch] text-[clamp(2.5rem,1.4rem+5vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">
        Things I built, <span className="voice text-accent-text">and what they showed.</span>
      </h1>
      <p className="mt-8 max-w-[56ch] text-[clamp(1.0625rem,1rem+0.45vw,1.3125rem)] leading-snug sm:ml-[25%]">
        Two shipped and three in progress. Each write-up covers the problem, the approach, the results, and what didn&rsquo;t
        work. Each number names the data it was measured on. Ideas with nothing built yet are on{" "}
        <Link href="/explorations" className="link">Explorations</Link>.
      </p>

      <ol className="mt-16 sm:mt-24">
        {projects.map((p, i) => (
          <li key={p.slug} data-reveal className="border-t border-rule" style={{ "--hue": projectHue(p.slug) } as React.CSSProperties}>
            <Link href={`/projects/${p.slug}`} className="group grid gap-6 py-10 sm:grid-cols-12 sm:gap-8 sm:py-14">
              <div className="sm:col-span-3">
                <p className="meta"><span className="text-hue">{String(i + 1).padStart(2, "0")}</span></p>
                <StatusBadge project={p} className="mt-2" />
              </div>
              <div className="sm:col-span-5">
                <h2 className="text-[clamp(1.75rem,1.3rem+2vw,3rem)] leading-none tracking-[-0.03em] group-hover:text-accent-text">{p.name}</h2>
                <p className="mt-4 text-[1.0625rem] leading-snug">{p.tagline}</p>
                {p.result && <p className="mt-3 text-[0.9375rem] leading-snug text-muted">{p.result}</p>}
                <p className="meta mt-5 normal-case tracking-normal">{p.tags.join(" · ")}</p>
              </div>
              <ProjectFigure slug={p.slug} className="sm:col-span-4" />
            </Link>
          </li>
        ))}
      </ol>

      <div className="grid gap-3 border-t border-ink pt-4 sm:grid-cols-12 sm:gap-8">
        <p className="meta sm:col-span-3">Tools on this site</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-2 sm:col-span-9">
          {tools.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="link">{t.label} →</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
