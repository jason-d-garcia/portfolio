import { ProjectCard } from "@/components/ProjectCard";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <>
      <section className="py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Applied ML for learning · Summer 2027</p>
        <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] font-semibold tracking-tight sm:text-7xl">
          {profile.headline}
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-soft">{profile.summary}</p>
      </section>

      <section id="work" className="scroll-mt-8">
        <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-soft">Selected work</h2>
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
        <p className="border-t border-rule pt-6 font-mono text-xs text-ink-soft">More write-ups are on the way.</p>
      </section>

      <section id="about" className="mt-24 grid scroll-mt-8 gap-12 sm:grid-cols-2">
        <div>
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-soft">Experience</h2>
          <ul className="space-y-6">
            {profile.experience.map((e) => (
              <li key={e.org}>
                <p className="font-serif text-xl font-semibold">
                  {e.org}
                  {e.role && <span className="font-sans text-base font-normal text-ink-soft"> · {e.role}</span>}
                </p>
                <p className="mt-1 text-ink-soft">{e.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-soft">Education</h2>
          <ul className="space-y-6">
            {profile.education.map((e) => (
              <li key={e.degree}>
                <p className="font-serif text-xl font-semibold">{e.degree}</p>
                <p className="mt-1 text-ink-soft">{[e.school, e.detail].filter(Boolean).join(" · ")}</p>
              </li>
            ))}
          </ul>
          <h2 className="mt-12 mb-4 font-mono text-xs uppercase tracking-widest text-ink-soft">Tools</h2>
          <ul className="flex flex-wrap gap-2 font-mono text-xs">
            {profile.skills.map((s) => (
              <li key={s} className="rounded-full border border-rule px-3 py-1 text-ink-soft">{s}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
