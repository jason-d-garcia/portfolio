import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MoodGrid } from "@/components/MoodGrid";
import { getProject, projects, statusText } from "@/content/projects";

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
    <section data-reveal className="grid gap-4 py-12 sm:grid-cols-[14rem_1fr] sm:gap-10 sm:py-16">
      <h2 className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight tracking-[-0.015em]">{label}</h2>
      <div className="min-w-0 max-w-[65ch] space-y-4">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-3 pl-5 marker:text-accent-text">
      {items.map((i) => <li key={i}>{i}</li>)}
    </ul>
  );
}

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const inProgress = project.status === "in-progress" || project.status === "concept";

  return (
    <article>
      <header className="px-4 pt-16 pb-14 sm:px-8 sm:pt-24 sm:pb-20">
        <Link href="/projects" className="text-muted underline-offset-4 hover:text-ink hover:underline">
          ← All projects
        </Link>
        <h1 className="mt-10 text-[clamp(3rem,1.6rem+7vw,8.5rem)] leading-[0.92] tracking-[-0.03em]">{project.name}</h1>
        <p className="mt-6 text-lg text-accent-text sm:text-xl">{statusText(project)}</p>
        <p className="mt-3 max-w-2xl text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)] leading-snug">{project.tagline}</p>
        {(project.demoUrl || project.repoUrl) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {project.demoUrl && (
              <a href={project.demoUrl} className="inline-flex h-12 items-center bg-accent px-6 text-lg text-accent-ink transition-transform hover:-translate-y-0.5">
                Open the demo ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} className="inline-flex h-12 items-center bg-surface px-6 text-lg transition-transform hover:-translate-y-0.5">
                Read the code ↗
              </a>
            )}
          </div>
        )}
      </header>

      {project.demoUrl ? (
        <div data-ui className="bg-surface px-4 py-8 sm:px-8">
          <iframe
            src={`${project.demoUrl}?embed`}
            title={`${project.name} live demo`}
            loading="lazy"
            className="h-[1400px] w-full bg-bg min-[820px]:h-[760px]"
          />
        </div>
      ) : (
        project.slug === "moodify" && (
          <div className="bg-surface px-4 py-10 sm:px-8">
            <MoodGrid className="mx-auto w-full max-w-md" />
          </div>
        )
      )}

      <div className="px-4 pb-16 sm:px-8">
        <Section label="Problem">
          <p>{project.problem}</p>
        </Section>

        {project.exists.length > 0 && (
          <Section label={inProgress ? "Done so far" : "What I built"}>
            <Bullets items={project.exists} />
          </Section>
        )}

        {project.approach.length > 0 && (
          <Section label="Approach">
            {project.approach.map((a) => (
              <div key={a.title} className="pb-2">
                <h3 className="text-xl font-medium">{a.title}</h3>
                <p className="mt-2">{a.body}</p>
                {a.formula && <pre className="mt-4 overflow-x-auto bg-surface p-4 text-sm">{a.formula}</pre>}
              </div>
            ))}
          </Section>
        )}

        {project.architecture.length > 0 && (
          <Section label="How it fits together">
            <ol className="list-decimal space-y-2 pl-5 marker:text-muted">
              {project.architecture.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </Section>
        )}
      </div>

      {project.metrics.length > 0 && (
        <section data-reveal className="bg-field-2 px-4 py-16 text-white sm:px-8 sm:py-24">
          <h2 className="text-[clamp(2rem,1.3rem+3.2vw,4rem)] leading-none tracking-[-0.02em]">Results</h2>
          <dl className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt className="text-lg">{m.label}</dt>
                <dd className="mt-1 text-[clamp(2.5rem,1.6rem+3.5vw,4.5rem)] leading-none tracking-[-0.02em] tabular-nums">{m.value}</dd>
                <dd className="mt-3 max-w-[48ch] text-[#dbe3ff]">{m.source}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="px-4 pb-24 sm:px-8">
        {project.limitations.length > 0 && (
          <Section label={project.metrics.length ? "Limitations" : "Status"}>
            <Bullets items={project.limitations} />
          </Section>
        )}

        {project.next.length > 0 && (
          <Section label="What's next">
            <Bullets items={project.next} />
          </Section>
        )}

        {project.credits && (
          <Section label="Credits">
            <p className="text-muted">{project.credits}</p>
          </Section>
        )}
      </div>
    </article>
  );
}
