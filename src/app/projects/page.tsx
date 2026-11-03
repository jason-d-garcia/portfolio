import type { Metadata } from "next";
import Link from "next/link";
import { ProjectNotebook } from "@/components/ProjectNotebook";

export const metadata: Metadata = {
  title: "Projects",
  description: "A notebook of applied ML projects by Jason Garcia: what was built, what was measured, and what is still in progress.",
};

const tools = [
  { href: "/vgc", label: "VGC team builder" },
  { href: "/creator-studio", label: "Creator studio: draft comparison" },
];

export default function ProjectsPage() {
  return (
    <section className="px-4 pt-14 pb-28 sm:px-8 sm:pt-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[clamp(2.5rem,1.6rem+3.5vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">Projects</h1>
          <p className="mt-5 max-w-[52ch] text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-snug">
            A notebook of what I built and what I found. Each entry opens on its evidence: a figure where one exists, the
            pipeline where one doesn&rsquo;t, and the headline number with its sample size on the page.
          </p>
        </div>
        <p className="max-w-xs font-sans text-sm leading-snug text-muted">
          Two shipped, two in progress and one idea, each labelled as what it is. Each number names the data it was measured on.
        </p>
      </div>

      <div className="mt-14 sm:mt-20">
        <ProjectNotebook />
      </div>

      <div className="mt-20 border-t border-surface pt-8 font-sans">
        <p className="text-sm text-muted">Tools on this site, built alongside the projects</p>
        <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
          {tools.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="underline-offset-4 hover:text-accent-text hover:underline">
                {t.label} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
