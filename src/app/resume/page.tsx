import type { Metadata } from "next";
import Link from "next/link";
import { Record } from "@/components/Record";
import { StatusBadge } from "@/components/StatusBadge";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { hasResume } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: "Jason Garcia's experience, education and projects.",
};

export default function ResumePage() {
  return (
    <article className="frame pt-14 pb-28 sm:pt-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="meta">Resume</p>
          <h1 className="mt-5 text-[clamp(2.5rem,1.4rem+5vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">{profile.name}</h1>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {hasResume && <li><a href="/resume.pdf" className="link">Download PDF ↓</a></li>}
          <li><a href={profile.links.linkedin} className="link">LinkedIn ↗</a></li>
          <li><a href={profile.links.github} className="link">GitHub ↗</a></li>
        </ul>
      </div>

      <div className="mt-14 sm:mt-20">
        <Record />
      </div>

      <section className="mt-16 grid gap-4 border-t border-ink pt-4 sm:grid-cols-12 sm:gap-8">
        <h2 className="meta sm:col-span-3">Projects</h2>
        <ul className="sm:col-span-9">
          {projects.map((p) => (
            <li key={p.slug} className="border-b border-rule py-5 first:pt-0">
              <Link href={`/projects/${p.slug}`} className="group grid gap-x-8 gap-y-1 sm:grid-cols-[1fr_14rem]">
                <div>
                  <p className="font-display text-xl leading-tight tracking-[-0.01em] group-hover:text-accent-text">{p.name}</p>
                  <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-snug">{p.result ?? p.tagline}</p>
                </div>
                <StatusBadge project={p} className="self-start sm:justify-self-end sm:pt-1.5 sm:text-right" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
