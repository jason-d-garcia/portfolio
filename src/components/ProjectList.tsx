import Link from "next/link";
import { projects, statusText } from "@/content/projects";

export function ProjectList() {
  return (
    <ul>
      {projects.map((p) => (
        <li key={p.slug} data-reveal>
          <Link
            href={`/projects/${p.slug}`}
            className="group grid gap-3 py-6 sm:py-8 lg:grid-cols-[1fr_minmax(16rem,28rem)] lg:gap-10"
          >
            <span className="block text-[clamp(2.25rem,1.4rem+4vw,5.25rem)] leading-[0.95] tracking-[-0.025em] transition-colors group-hover:text-accent-text">
              {p.name}
            </span>
            <span className="block max-w-md lg:pt-3">
              <span className="block text-base text-accent-text sm:text-lg">{statusText(p)}</span>
              <span className="mt-1 block text-muted">{p.tagline}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
