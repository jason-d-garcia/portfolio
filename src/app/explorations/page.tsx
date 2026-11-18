import type { Metadata } from "next";
import Link from "next/link";
import { explorations, openQuestions } from "@/content/explorations";

export const metadata: Metadata = {
  title: "Explorations",
  description: "Ideas, unfinished experiments and research in progress by Jason Garcia, each labelled as what it is.",
};

export default function ExplorationsPage() {
  return (
    <article className="frame pt-14 pb-28 sm:pt-20">
      <p className="meta">Explorations</p>
      <h1 className="mt-5 max-w-[18ch] text-[clamp(2.5rem,1.4rem+5vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">
        What I&rsquo;m working out, <span className="voice text-accent-text">and haven&rsquo;t yet.</span>
      </h1>
      <p className="mt-8 max-w-[56ch] text-[clamp(1.0625rem,1rem+0.45vw,1.3125rem)] leading-snug sm:ml-[25%]">
        Research in progress, next experiments and plain ideas. The label beside each one says how far it has got. Where it
        says &ldquo;idea&rdquo;, nothing is built.
      </p>

      <ol className="mt-16 sm:mt-24">
        {explorations.map((e, i) => (
          <li key={e.id} id={e.id} data-reveal className="grid scroll-mt-6 gap-4 border-t border-rule py-10 sm:grid-cols-12 sm:gap-8 sm:py-14">
            <div className="sm:col-span-3">
              <p className="meta"><span className="text-accent-text">{String(i + 1).padStart(2, "0")}</span> / {e.stage}</p>
              <p className="meta mt-2 normal-case tracking-normal max-sm:hidden">{e.fields.join(" · ")}</p>
            </div>
            <div className="sm:col-span-8">
              <h2 className="text-[clamp(1.5rem,1.2rem+1.4vw,2.5rem)] leading-[1.05] tracking-[-0.025em]">{e.title}</h2>
              <p className="voice mt-3 text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-snug text-muted">{e.question}</p>
              <div className="mt-5 max-w-[62ch] space-y-4">
                {e.body.map((b) => <p key={b}>{b}</p>)}
              </div>
              {e.link && (
                <p className="mt-5">
                  <Link href={e.link.href} className="link">{e.link.label} →</Link>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section data-reveal className="grid gap-4 border-t border-ink pt-4 sm:grid-cols-12 sm:gap-8">
        <h2 className="meta sm:col-span-3">Questions I keep coming back to</h2>
        <ul className="space-y-3 sm:col-span-8">
          {openQuestions.map((q) => (
            <li key={q} className="font-display text-[clamp(1.25rem,1.1rem+0.8vw,1.75rem)] leading-tight tracking-[-0.015em]">{q}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
