import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoEmbed } from "@/components/DemoEmbed";
import { BallroomBaselines } from "@/components/demos/BallroomBaselines";
import { ConformalCoverage } from "@/components/demos/ConformalCoverage";
import { HookLiftChart } from "@/components/demos/HookLiftChart";
import { MoodMapSample } from "@/components/demos/MoodMapSample";
import { hasFigure, ProjectFigure, projectHue } from "@/components/previews";
import { StatusBadge } from "@/components/StatusBadge";
import { getProject, projectPages, projects, type DemoKey } from "@/content/projects";

const demos: Record<DemoKey, () => React.ReactNode> = {
  "hook-lift": () => <HookLiftChart />,
  "conformal-coverage": () => <ConformalCoverage />,
  "ballroom-baselines": () => <BallroomBaselines />,
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projectPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.name, description: project.tagline } : {};
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section data-reveal className="grid gap-4 border-t border-rule py-10 sm:grid-cols-12 sm:gap-8 sm:py-14">
      <h2 className="meta section-label sm:col-span-3">{label}</h2>
      <div className="min-w-0 max-w-[65ch] space-y-4 sm:col-span-8">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="grid grid-cols-[1.25rem_1fr]">
          <span aria-hidden className="text-hue">–</span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

const button = "inline-flex h-11 items-center px-5 text-[0.9375rem] transition-transform hover:-translate-y-0.5 active:translate-y-0";

export default async function ProjectPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const inProgress = project.status === "in-progress" || project.status === "concept";
  const isSenti = project.slug === "senti";
  const index = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = index >= 0 ? projects[(index + 1) % projects.length] : undefined;
  const hasLinks = project.demoUrl || project.repoUrl || project.paperUrl || project.tool;

  return (
    <article className="frame numbered" style={{ "--hue": projectHue(project.slug) } as React.CSSProperties}>
      <header className={`grid grid-cols-1 gap-8 pt-10 pb-12 sm:grid-cols-12 sm:pt-16 sm:pb-20 ${isSenti ? "sm:items-start" : "sm:items-end"}`}>
        <div className={`min-w-0 ${hasFigure(project.slug) ? "sm:col-span-7" : "sm:col-span-9"}`}>
          <p className="meta flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href={index >= 0 ? "/projects" : "/explorations"} className="hover:text-ink">
              ← {index >= 0 ? "Projects" : "Explorations"}
            </Link>
            <StatusBadge project={project} />
          </p>
          <h1 className="mt-6 text-[clamp(2.75rem,1.6rem+5vw,6rem)] leading-[0.92] tracking-[-0.04em]">{project.name}</h1>
          <p className="mt-5 max-w-[34ch] text-[clamp(1.25rem,1.1rem+0.8vw,1.75rem)] leading-[1.2] tracking-[-0.01em]">{project.tagline}</p>
          {project.result && <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-snug text-muted">{project.result}</p>}
          <p className="meta mt-5 normal-case tracking-normal">{project.tags.join(" · ")}</p>
          {hasLinks && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.tool && (
                <Link href={project.tool.href} className={`${button} bg-ink text-bg`}>{project.tool.label} →</Link>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} className={`${button} bg-ink text-bg`}>Open the demo ↗</a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} className={`${button} border border-rule hover:border-ink`}>Read the code ↗</a>
              )}
              {project.paperUrl && (
                <a href={project.paperUrl} className={`${button} border border-rule hover:border-ink`}>Read the report (PDF) ↗</a>
              )}
            </div>
          )}
        </div>
        {hasFigure(project.slug) && !isSenti && <ProjectFigure slug={project.slug} className="sm:col-span-5" />}
        {isSenti && (
          <div className="min-w-0 bg-surface p-4 sm:col-span-5 sm:p-6">
            <p className="meta mb-3">Try it: drag the point</p>
            <MoodMapSample />
          </div>
        )}
      </header>

      {project.demoUrl && (
        <div data-ui className="mb-12 bg-surface p-4 sm:p-8">
          <DemoEmbed url={project.demoUrl} name={project.name}>
            <p className="max-w-[40ch] text-[1.0625rem] leading-snug">
              The full app, with every song on the map, 30-second previews and the listener rating mode.
            </p>
          </DemoEmbed>
        </div>
      )}

      <Section label="Overview">
        <p className="text-[1.0625rem]">{project.problem}</p>
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
              <h3 className="font-display text-xl font-medium tracking-[-0.01em]">{a.title}</h3>
              <p className="mt-2">{a.body}</p>
              {a.formula && <pre className="mt-4 overflow-x-auto bg-surface p-4 font-mono text-sm">{a.formula}</pre>}
            </div>
          ))}
        </Section>
      )}

      {project.architecture.length > 0 && (
        <Section label="How it fits together">
          <ol className="font-mono text-[0.8125rem] leading-snug">
            {project.architecture.map((step, i) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] border-l border-hue py-2 pl-4">
                <span className="text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {project.surprise && (
        <Section label="Expected vs. what happened">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="meta">What I expected</h3>
              <p className="mt-2">{project.surprise.expected}</p>
            </div>
            <div>
              <h3 className="meta text-hue">What happened</h3>
              <p className="mt-2">{project.surprise.happened}</p>
            </div>
          </div>
        </Section>
      )}

      {(project.metrics.length > 0 || project.findings?.length) && (
        <Section label="Results">
          {project.findings?.map((f) => (
            <div key={f.title} className="pb-6">
              <h3 className="font-display text-xl font-medium tracking-[-0.01em]">{f.title}</h3>
              <p className="mt-2">{f.body}</p>
              {f.demo && <div className="mt-6 border-t border-rule pt-6">{demos[f.demo]()}</div>}
            </div>
          ))}
          {project.findings?.length && project.metrics.length > 0 ? (
            <h3 className="pt-4 font-display text-xl font-medium tracking-[-0.01em]">In numbers</h3>
          ) : null}
          {/* Three columns from sm up; on phones each row stacks (label and value, then the source). */}
          <table className="w-full border-collapse text-left max-sm:block">
            <thead className="meta max-sm:sr-only">
              <tr className="border-b border-rule">
                <th scope="col" className="py-2 pr-4 font-normal">Metric</th>
                <th scope="col" className="py-2 pr-4 font-normal">Value</th>
                <th scope="col" className="py-2 font-normal">Measured on</th>
              </tr>
            </thead>
            <tbody className="max-sm:block">
              {project.metrics.map((m) => (
                <tr key={m.label} className="border-b border-rule align-top max-sm:grid max-sm:grid-cols-[1fr_auto] max-sm:gap-x-4 max-sm:py-4">
                  <th scope="row" className="py-4 pr-4 font-normal max-sm:block max-sm:py-0 max-sm:pr-0">{m.label}</th>
                  <td className="py-3 pr-4 font-display text-[1.75rem] leading-none tracking-[-0.02em] whitespace-nowrap tabular-nums text-hue max-sm:block max-sm:py-0 max-sm:pr-0">{m.value}</td>
                  <td className="py-4 text-sm leading-snug text-muted max-sm:col-span-2 max-sm:block max-sm:pt-2 max-sm:pb-0">{m.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {project.limitations.length > 0 && (
        <Section label={project.metrics.length ? "Limitations" : "Status"}>
          <Bullets items={project.limitations} />
        </Section>
      )}

      {project.next.length > 0 && (
        <Section label="What I'd do next">
          <Bullets items={project.next} />
        </Section>
      )}

      {(hasLinks || project.credits) && (
        <Section label="Links and credits">
          {hasLinks && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {project.tool && <li><Link href={project.tool.href} className="link">{project.tool.label} →</Link></li>}
              {project.demoUrl && <li><a href={project.demoUrl} className="link">Live demo ↗</a></li>}
              {project.repoUrl && <li><a href={project.repoUrl} className="link">Code ↗</a></li>}
              {project.paperUrl && <li><a href={project.paperUrl} className="link">Report (PDF) ↗</a></li>}
            </ul>
          )}
          {project.credits && <p className="text-[0.9375rem] text-muted">{project.credits}</p>}
        </Section>
      )}

      {nextProject && nextProject.slug !== project.slug && (
        <Link href={`/projects/${nextProject.slug}`} className="group grid gap-2 border-t border-ink pt-4 pb-24 sm:grid-cols-12 sm:gap-8">
          <span className="meta sm:col-span-3">Next project</span>
          <span className="font-display text-[clamp(1.75rem,1.3rem+2vw,3rem)] leading-none tracking-[-0.03em] group-hover:text-accent-text sm:col-span-9">
            {nextProject.name} →
          </span>
        </Link>
      )}
      {!nextProject && <div className="pb-24" />}
    </article>
  );
}
