import Link from "next/link";
import { type Project, statusLabel } from "@/content/projects";
import { MoodGrid } from "./MoodGrid";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid gap-8 border-t border-rule py-10 sm:grid-cols-[1fr_16rem] sm:items-center"
    >
      <div>
        <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ink-soft">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-rule" />
          <span>{statusLabel[project.status]}</span>
        </div>
        <h3 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="bg-[linear-gradient(var(--accent),var(--accent))] bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_3px]">
            {project.name}
          </span>
        </h3>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">{project.tagline}</p>
        <ul className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full border border-rule px-3 py-1 text-ink-soft">{t}</li>
          ))}
        </ul>
      </div>
      {project.slug === "moodify" && <MoodGrid className="w-full max-w-64 justify-self-center" />}
    </Link>
  );
}
