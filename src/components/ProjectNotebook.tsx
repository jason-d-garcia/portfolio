import Link from "next/link";
import { FigureTile } from "@/components/FigureTile";
import { StatusBadge } from "@/components/StatusBadge";
import { projects } from "@/content/projects";

/* The research-notebook grid: each entry opens on its figure (or pipeline sketch) and its headline result. */
export function ProjectNotebook() {
  return (
    <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2">
      {projects.map((p, i) => (
        <li key={p.slug} data-reveal className="min-w-0">
          <Link href={`/projects/${p.slug}`} className="group block">
            <FigureTile project={p} priority={i < 2} />
            <span className="mt-5 block">
              <span className="block text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent-text">
                {p.name}
              </span>
              {p.figure && <StatusBadge project={p} className="mt-2" />}
              <span className="mt-2 block text-ink">{p.result ?? p.tagline}</span>
              <span className="mt-3 block font-mono text-xs text-muted">{p.tags.join(" · ")}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
