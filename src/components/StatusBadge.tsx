import { statusText, type Project } from "@/content/projects";

const dot: Record<Project["status"], string> = {
  live: "bg-accent",
  shipped: "bg-accent",
  "in-progress": "bg-field-4 ring-1 ring-ink/40",
  concept: "bg-transparent ring-1 ring-muted",
  research: "bg-field-2",
};

export function StatusBadge({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <span className={`meta inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden className={`inline-block size-2 shrink-0 rounded-full ${dot[project.status]}`} />
      {statusText(project)}
    </span>
  );
}
