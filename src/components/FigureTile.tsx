import { StatusBadge } from "@/components/StatusBadge";
import type { Project } from "@/content/projects";

/*
 * The notebook's figure slot. With a real export it shows the figure. Without one it draws the
 * project's pipeline as a numbered sketch, so an in-progress project looks honest rather than empty.
 */
export function FigureTile({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.figure) {
    return (
      <figure className="m-0">
        <div className="aspect-[16/10] overflow-hidden bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.figure.src} alt={project.figure.alt} className="size-full object-cover" loading={priority ? "eager" : "lazy"} />
        </div>
        <figcaption className="mt-2 font-sans text-sm text-muted">
          {project.figure.caption} <span className="text-muted/70">({project.figure.source})</span>
        </figcaption>
      </figure>
    );
  }

  const steps = project.architecture.slice(0, 5);
  return (
    <div className="relative flex aspect-[16/10] flex-col justify-between overflow-hidden bg-surface p-4 sm:p-5">
      <StatusBadge project={project} />
      {steps.length > 0 ? (
        <ol className="min-w-0 overflow-hidden pb-5 font-mono text-[0.8rem] leading-relaxed text-ink sm:text-sm">
          {steps.map((s, i) => (
            <li key={s} className="flex min-w-0 gap-3">
              <span className="w-5 shrink-0 text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="truncate">{s}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="max-w-[28ch] text-lg italic leading-snug">{project.tagline}</p>
      )}
      <span className="absolute right-4 bottom-3 font-sans text-xs uppercase tracking-wide text-muted sm:right-5">
        {steps.length > 0 ? "Pipeline sketch" : "Concept"}
      </span>
    </div>
  );
}
