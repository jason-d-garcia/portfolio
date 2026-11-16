import type { Metadata } from "next";
import Link from "next/link";
import { Record } from "@/components/Record";
import { profile } from "@/content/profile";
import { values, valuesLead } from "@/content/values";

export const metadata: Metadata = {
  title: "About",
  description: "Jason Garcia: MS Computer Science at BYU, teacher since 2020, working in machine learning, optimization and interactive software.",
};

export default function AboutPage() {
  return (
    <article className="frame pt-14 pb-28 sm:pt-20">
      <p className="meta">About</p>
      <h1 className="mt-5 max-w-[17ch] text-[clamp(2.5rem,1.4rem+5vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">
        A builder with a math degree <span className="voice text-accent-text">and a piano habit.</span>
      </h1>

      <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-12">
        <div className="max-w-[62ch] space-y-5 sm:col-span-8 sm:col-start-4">
          <p className="text-[clamp(1.125rem,1rem+0.6vw,1.5rem)] leading-snug">
            I&rsquo;m Jason Garcia. I&rsquo;m finishing an MS in Computer Science at BYU in December 2027, after a BS in
            Mathematics, and I&rsquo;ve taught math and programming at Juni Learning since 2020.
          </p>
          <p>
            I&rsquo;m interested in how computation can help us understand complicated systems, find patterns, and build things
            that make people&rsquo;s lives better. My work covers machine learning, optimization and interactive software. It is
            shaped by things that are not software: mathematics, music, dance and teaching.
          </p>
          <p>
            I like moving between the abstract and the practical. I want to know why a method works, and then I want to put it
            in front of someone as a thing they can use. Most of my <Link href="/projects" className="link">projects</Link> end
            in something you can click on, and all of them end with a list of what didn&rsquo;t work.
          </p>
          <p>
            Teaching is where my interest in machine learning comes from. Every student deserves a fair chance to learn, and
            good tools can make that chance more equal.
          </p>
        </div>
      </div>

      <section className="mt-20 grid gap-4 border-t border-ink pt-4 sm:mt-28 sm:grid-cols-12 sm:gap-8">
        <h2 className="meta sm:col-span-3">What matters</h2>
        <div className="sm:col-span-9">
          <p className="max-w-[30ch] font-display text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] leading-[1.08] tracking-[-0.025em]">
            Technology is a means. <span className="voice">The point is who it helps.</span>
          </p>
          <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-snug">{valuesLead}</p>
          <dl className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.name}>
                <dt className="meta text-ink">{v.name}</dt>
                <dd className="mt-2 max-w-[44ch] text-[0.9375rem] leading-snug text-muted">{v.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-20 grid gap-4 border-t border-ink pt-4 sm:mt-28 sm:grid-cols-12 sm:gap-8">
        <h2 className="meta sm:col-span-3">What I&rsquo;m looking for</h2>
        <div className="max-w-[62ch] space-y-4 sm:col-span-8">
          <p>
            A Summer 2027 internship in applied ML. I&rsquo;m most interested in teams building for learners, and open to
            applied-AI teams building tools people use every day. Longer term I want to build products of my own.
          </p>
          <p>
            Reach me on <a href={profile.links.github} className="link">GitHub</a> and{" "}
            <a href={profile.links.linkedin} className="link">LinkedIn</a>
            {profile.links.email && (
              <>
                , or at <a href={`mailto:${profile.links.email}`} className="link">{profile.links.email}</a>
              </>
            )}
            .
          </p>
        </div>
      </section>

      <div className="mt-20 sm:mt-28">
        <Record />
      </div>
    </article>
  );
}
