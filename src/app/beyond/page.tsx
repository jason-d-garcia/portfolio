import type { Metadata } from "next";
import Link from "next/link";
import { musicBackground, works } from "@/content/music";

export const metadata: Metadata = {
  title: "Beyond the Code",
  description: "Music, ballroom, mathematics, languages and the other things Jason Garcia does away from the keyboard.",
};

const dance = [
  "Competitive ballroom dancer since college, with wins at local competitions.",
  "ISTD Licentiate in International Latin.",
  "Rehearsal assistant for BYU Ballroom Showcase Company, running Standard rehearsals.",
  "Training with a professional coach since 2024.",
];

const interests: { name: string; body: string }[] = [
  { name: "Mathematics", body: "My first degree. I like knowing why an algorithm works, not only how to call it, and I like the subject for its own sake too." },
  { name: "Languages", body: "Spanish and Italian (B2), German and Russian (B1), some Portuguese and French. I'm curious about how languages are built as much as about speaking them." },
  { name: "Teaching", body: "Senior instructor at Juni Learning since 2020 and a trainer on its Instructor Success Team. I wrote Juni's on-demand Minecraft digital-logic course, the third most popular on the platform." },
  { name: "Economics", body: "How incentives and systems shape what people do. It is the lens I borrow most often outside of math." },
  { name: "Sport", body: "Varsity soccer, and a lasting interest in how strategy can be measured." },
  { name: "Service", body: "Stake clerk: led a multi-stake boundary proposal affecting about 5,000 members and trained 20+ ward clerks. High council: organized temple service projects with 50+ volunteers. Sunday School president." },
  { name: "Odds and ends", body: "Played the lead in my high school musical. I solve a Rubik's cube in under 20 seconds on average." },
];

// Five bars of a rhythm, drawn as the page's rule: long, short-short, long, rest, long. Decoration with a pulse.
function RhythmRule() {
  const beats = [3, 1, 1, 3, 0, 2, 1, 1, 2, 0, 3, 1, 1, 3];
  return (
    <div aria-hidden className="flex h-3 items-end gap-1.5">
      {beats.map((b, i) => (
        <span key={i} className={b ? "h-px bg-ink" : "h-px"} style={{ flex: b || 1 }} />
      ))}
    </div>
  );
}

export default function BeyondPage() {
  return (
    <article className="frame pt-14 pb-28 sm:pt-20">
      <p className="meta">Beyond the Code</p>
      <h1 className="mt-5 max-w-[18ch] text-[clamp(2.5rem,1.4rem+5vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">
        The rest of what <span className="voice text-accent-text">I spend my hours on.</span>
      </h1>

      <section id="music" className="mt-16 scroll-mt-6 sm:mt-24">
        <RhythmRule />
        <div className="mt-4 grid gap-6 sm:grid-cols-12 sm:gap-8">
          <h2 className="meta sm:col-span-3"><span className="text-accent-text">01</span> / Music</h2>
          <div className="sm:col-span-8">
            <p className="max-w-[26ch] font-display text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] leading-[1.08] tracking-[-0.025em]">
              I nearly became a pianist. <span className="voice">I still think like one.</span>
            </p>
            <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-snug">
              Music is where I learned that structure and feeling are not opposites. A piece works because its harmony, rhythm
              and form are precise, and it matters because of what a listener feels. I look for the same thing in software.
              Most of the time, though, music is just music, and I value it for that.
            </p>
            <ul className="mt-8 max-w-[60ch] space-y-3">
              {musicBackground.map((m) => (
                <li key={m} className="grid grid-cols-[1.25rem_1fr]">
                  <span aria-hidden className="text-accent-text">–</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>

            <h3 className="meta mt-14">Selected works</h3>
            <ol className="mt-3">
              {works.map((w) => (
                <li key={w.title} data-reveal className="grid gap-x-8 gap-y-2 border-t border-rule py-5 last:border-b sm:grid-cols-[1fr_14rem]">
                  <div>
                    <p className="font-display text-xl leading-tight tracking-[-0.01em]">{w.title}</p>
                    <p className="mt-1 text-[0.9375rem] leading-snug text-muted">{w.note}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="meta">{w.kind}</p>
                    {w.media?.type === "audio" && <audio controls preload="none" src={w.media.src} className="mt-2 h-9 w-full" />}
                    {w.media && w.media.type !== "audio" && (
                      <a href={w.media.src} className="link mt-2 inline-block text-[0.9375rem]">
                        {w.media.type === "score" ? "Read the score ↗" : "Watch ↗"}
                      </a>
                    )}
                    {!w.media && <p className="meta mt-1 normal-case tracking-normal">Recording to come</p>}
                  </div>
                </li>
              ))}
            </ol>

            <h3 className="meta mt-14">Where it meets the code</h3>
            <p className="mt-3 max-w-[60ch]">
              Two projects started from music: <Link href="/projects/senti" className="link">senti</Link>, a map of songs
              arranged by how they feel, and the <Link href="/projects/ballroom" className="link">ballroom style finder</Link>,
              which names the dances a song fits. The <Link href="/" className="link">score on the home page</Link> draws
              everything on this site as chords you can play.
            </p>
          </div>
        </div>
      </section>

      <section id="dance" className="mt-20 scroll-mt-6 sm:mt-28">
        <RhythmRule />
        <div className="mt-4 grid gap-6 sm:grid-cols-12 sm:gap-8">
          <h2 className="meta sm:col-span-3"><span className="text-accent-text">02</span> / Ballroom</h2>
          <div className="sm:col-span-8">
            <p className="max-w-[28ch] font-display text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] leading-[1.08] tracking-[-0.025em]">
              Part sport, part art, <span className="voice">and a good deal of physics.</span>
            </p>
            <ul className="mt-8 max-w-[60ch] space-y-3">
              {dance.map((d) => (
                <li key={d} className="grid grid-cols-[1.25rem_1fr]">
                  <span aria-hidden className="text-accent-text">–</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="interests" className="mt-20 scroll-mt-6 sm:mt-28">
        <RhythmRule />
        <div className="mt-4 grid gap-6 sm:grid-cols-12 sm:gap-8">
          <h2 className="meta sm:col-span-3"><span className="text-accent-text">03</span> / Everything else</h2>
          <dl className="grid gap-x-8 gap-y-8 sm:col-span-9 sm:grid-cols-2">
            {interests.map((g) => (
              <div key={g.name} data-reveal>
                <dt className="font-display text-xl tracking-[-0.01em]">{g.name}</dt>
                <dd className="mt-2 max-w-[44ch] text-[0.9375rem] leading-snug text-muted">{g.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </article>
  );
}
