import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoodGrid } from "@/components/MoodGrid";
import { getProject, projects, statusLabel } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.name, description: project.tagline } : {};
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-rule py-10 sm:grid-cols-[12rem_1fr]">
      <h2 className="font-mono text-xs uppercase tracking-widest text-ink-soft">{label}</h2>
      <div className="min-w-0 space-y-4 text-lg leading-relaxed">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <article>
      <header className="py-16 sm:py-20">
        <Link href="/#work" className="font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-ink">
          ← All work
        </Link>
        <p className="mt-10 font-mono text-xs uppercase tracking-widest text-accent">{statusLabel[project.status]}</p>
        <h1 className="mt-4 font-serif text-6xl font-semibold tracking-tight sm:text-8xl">{project.name}</h1>
        <p className="mt-6 max-w-2xl text-xl text-ink-soft">{project.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-4 font-mono text-sm">
          {project.demoUrl && (
            <a href={project.demoUrl} className="rounded-full bg-ink px-5 py-2 text-paper hover:bg-accent">Open demo ↗</a>
          )}
          <a href={project.repoUrl} className="rounded-full border border-ink px-5 py-2 hover:border-accent hover:text-accent">Code ↗</a>
        </div>
      </header>

      <div className="mb-10 overflow-hidden rounded-lg border border-rule bg-paper-2">
        {project.demoUrl ? (
          <iframe src={`${project.demoUrl}?embed`} title={`${project.name} demo`} className="h-[1400px] w-full min-[820px]:h-[760px]" />
        ) : (
          <div className={`grid items-center gap-8 p-8 ${project.slug === "moodify" ? "sm:grid-cols-[18rem_1fr]" : ""}`}>
            {project.slug === "moodify" && <MoodGrid className="w-full max-w-72 justify-self-center" />}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Live demo in progress</p>
              <p className="mt-3 text-lg text-ink-soft">
                The interactive version will appear here once it is deployed. Until then, this page describes what exists today and what is still being built.
              </p>
            </div>
          </div>
        )}
      </div>

      <Section label="Problem">
        <p>{project.problem}</p>
      </Section>

      <Section label="What exists today">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          {project.exists.map((e) => <li key={e}>{e}</li>)}
        </ul>
      </Section>

      <Section label="Approach">
        {project.approach.map((a) => (
          <div key={a.title}>
            <h3 className="font-serif text-2xl font-semibold">{a.title}</h3>
            <p className="mt-2 text-ink-soft">{a.body}</p>
            {a.formula && (
              <pre className="mt-4 overflow-x-auto rounded-md bg-paper-2 p-4 font-mono text-sm">{a.formula}</pre>
            )}
          </div>
        ))}
      </Section>

      <Section label="Architecture">
        <ol className="flex flex-col gap-2 font-mono text-sm sm:flex-row sm:flex-wrap sm:items-center">
          {project.architecture.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-md border border-rule bg-paper-2 px-3 py-2">{step}</span>
              {i < project.architecture.length - 1 && <span className="text-accent">→</span>}
            </li>
          ))}
        </ol>
      </Section>

      <Section label="Results">
        <dl className="grid gap-4 sm:grid-cols-2">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-md border border-rule p-5">
              <dt className="font-mono text-xs uppercase tracking-widest text-ink-soft">{m.label}</dt>
              <dd className="mt-2 font-serif text-4xl font-semibold">{m.value || "—"}</dd>
              <dd className="mt-2 text-sm text-ink-soft">{m.source}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Limitations">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          {project.limitations.map((l) => <li key={l}>{l}</li>)}
        </ul>
      </Section>

      <Section label="Next">
        <ul className="list-disc space-y-2 pl-5 marker:text-accent">
          {project.next.map((n) => <li key={n}>{n}</li>)}
        </ul>
      </Section>

      {project.credits && (
        <Section label="Credits">
          <p className="text-base text-ink-soft">{project.credits}</p>
        </Section>
      )}
    </article>
  );
}
