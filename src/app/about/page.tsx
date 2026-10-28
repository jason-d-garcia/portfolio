import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: "Jason Garcia: MS Computer Science at BYU, teacher since 2020, looking for a Summer 2027 internship in applied ML for learning.",
};

export default function AboutPage() {
  return (
    <article className="px-4 pt-16 pb-28 sm:px-8 sm:pt-24">
      <h1 className="text-[clamp(3rem,1.6rem+7vw,8.5rem)] leading-[0.92] tracking-[-0.03em]">About</h1>
      <div className="mt-12 max-w-[62ch] space-y-6 sm:ml-[22%]">
        <p className="text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)] leading-snug">
          I&rsquo;m Jason Garcia. I&rsquo;m finishing an MS in Computer Science at BYU in December 2027, after a BS in Mathematics,
          and I&rsquo;ve taught math and programming at Juni Learning since 2020.
        </p>
        <h2 className="pt-6 text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight">What I care about</h2>
        <p>
          Learning. Every student deserves a fair chance to learn, and good tools can make that chance more equal. I build machine
          learning that people can use, and I try to measure it honestly: what it gets right, where it fails and what I
          haven&rsquo;t tested yet.
        </p>
        <h2 className="pt-6 text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight">What I&rsquo;m looking for</h2>
        <p>
          A Summer 2027 internship in applied ML for learning. I&rsquo;m open to EdTech teams and to applied-AI teams building tools
          people use every day. Right now I&rsquo;m a data science intern at The Church of Jesus Christ of Latter-day Saints, and
          I&rsquo;m finishing two <Link href="/projects" className="underline underline-offset-4 hover:text-accent-text">projects</Link> by December.
        </p>
        <h2 className="pt-6 text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight">How to reach me</h2>
        <p>
          On{" "}
          <a href={profile.links.github} className="underline underline-offset-4 hover:text-accent-text">GitHub</a> and{" "}
          <a href={profile.links.linkedin} className="underline underline-offset-4 hover:text-accent-text">LinkedIn</a>
          {profile.links.email && (
            <>
              , or by email at{" "}
              <a href={`mailto:${profile.links.email}`} className="underline underline-offset-4 hover:text-accent-text">{profile.links.email}</a>
            </>
          )}
          .
        </p>
      </div>
    </article>
  );
}
