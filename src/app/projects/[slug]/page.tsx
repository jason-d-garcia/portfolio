import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoEmbed } from "@/components/DemoEmbed";
import { FigureTile } from "@/components/FigureTile";
import { MoodGrid } from "@/components/MoodGrid";
import { StatusBadge } from "@/components/StatusBadge";
import { getProject, projects } from "@/content/projects";

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
        <h1 className="mt-8 text-[clamp(2.75rem,1.6rem+4.5vw,6rem)] leading-[0.95] tracking-[-0.03em]">{project.name}</h1>
        <StatusBadge project={project} className="mt-5 text-base" />
        <p className="mt-3 max-w-2xl text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)] leading-snug">{project.tagline}</p>
        {project.result && <p className="mt-4 max-w-[60ch] font-sans text-muted">{project.result}</p>}
        {(project.demoUrl || project.repoUrl || project.tool) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {project.tool && (
              <Link href={project.tool.href} className="inline-flex h-12 items-center bg-accent px-6 font-sans text-base text-accent-ink transition-transform hover:-translate-y-0.5">
                {project.tool.label} →
              </Link>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} className="inline-flex h-12 items-center bg-accent px-6 font-sans text-base text-accent-ink transition-transform hover:-translate-y-0.5">
                Open the demo ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} className="inline-flex h-12 items-center bg-surface px-6 font-sans text-base transition-transform hover:-translate-y-0.5">
                Read the code ↗
              </a>
            )}
          </div>
        )}
      </header>

      {project.figure && (
        <div className="px-4 pb-4 sm:px-8">
          <div className="max-w-5xl">
            <FigureTile project={project} priority />
          </div>
        </div>
      )}

      {project.demoUrl ? (
        <div data-ui className="bg-surface px-4 py-8 sm:px-8">
          <DemoEmbed url={project.demoUrl} name={project.name}>
            {project.slug === "moodify" ? (
              <MoodGrid className="w-full max-w-md" />
            ) : (
              <FigureTile project={project} />
            )}
          </DemoEmbed>
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
        <div className="px-4 sm:px-8">
          <Section label="Results">
            <table className="w-full border-collapse text-left">
              <thead className="font-sans text-sm text-muted">
                <tr className="border-b border-surface">
                  <th scope="col" className="py-2 pr-4 font-normal">Metric</th>
                  <th scope="col" className="py-2 pr-4 font-normal">Value</th>
                  <th scope="col" className="py-2 font-normal">Measured on</th>
                </tr>
              </thead>
              <tbody>
                {project.metrics.map((m) => (
                  <tr key={m.label} className="border-b border-surface align-top">
                    <th scope="row" className="py-4 pr-4 font-normal">{m.label}</th>
                    <td className="py-3 pr-4 text-[1.75rem] leading-none tracking-[-0.02em] whitespace-nowrap tabular-nums text-accent-text">{m.value}</td>
                    <td className="py-4 font-sans text-sm leading-snug text-muted">{m.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>
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
