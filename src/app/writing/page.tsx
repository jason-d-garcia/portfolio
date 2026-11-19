import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/content/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays by Jason Garcia on rigor, judgment and structure, drawn from machine learning, music, ballroom and teaching.",
};

export default function WritingPage() {
  return (
    <section className="frame pt-14 pb-28 sm:pt-20">
      <p className="meta">Writing</p>
      <h1 className="mt-5 max-w-[16ch] text-[clamp(2.5rem,1.4rem+5vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">
        Ideas I keep <span className="voice text-accent-text">talking myself into.</span>
      </h1>
      <p className="mt-8 max-w-[56ch] text-[clamp(1.0625rem,1rem+0.45vw,1.3125rem)] leading-snug sm:ml-[25%]">
        I think best out loud. Each of these began as me talking an idea through, usually one that started in a practice room
        or a classroom and turned out to be about machine learning too. I edit the transcript into an essay afterwards.
      </p>

      <ol className="mt-16 sm:mt-24">
        {posts.map((p, i) => (
          <li key={p.slug} data-reveal className="border-t border-rule last:border-b">
            <Link href={`/writing/${p.slug}`} className="group grid gap-4 py-10 sm:grid-cols-12 sm:gap-8 sm:py-14">
              <div className="sm:col-span-3">
                <p className="meta">
                  <span className="text-accent-text">{String(i + 1).padStart(2, "0")}</span> / {p.when}
                </p>
                {p.draft && <p className="meta mt-2">Draft</p>}
              </div>
              <div className="sm:col-span-8">
                <h2 className="text-[clamp(1.75rem,1.3rem+2vw,3rem)] leading-none tracking-[-0.03em] group-hover:text-accent-text">{p.title}</h2>
                <p className="voice mt-4 text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-snug text-muted">{p.dek}</p>
                <p className="meta mt-5 normal-case tracking-normal">{p.themes.join(" · ")}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
