import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { projects } from "@/content/projects";

/* Home page list: name, status, one result line. The notebook on /projects carries the figures. */
export function ProjectList() {
  return (
    <ul className="divide-y divide-surface">
      {projects.map((p) => (
        <li key={p.slug} data-reveal>
          <Link
            href={`/projects/${p.slug}`}
            className="group grid gap-2 py-6 sm:py-7 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10"
          >
            <span className="block">
              <span className="block text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent-text">
                {p.name}
              </span>
              <StatusBadge project={p} className="mt-2" />
            </span>
            <span className="block max-w-[60ch] lg:pt-1">
              <span className="block">{p.tagline}</span>
              {p.result && <span className="mt-2 block font-sans text-[0.95rem] leading-snug text-muted">{p.result}</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
