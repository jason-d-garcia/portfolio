import { getProject, projects, statusText } from "@/content/projects";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project by Jason Garcia";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  return ogImage(project?.name ?? "Project", project ? `${statusText(project)}. ${project.tagline}` : "");
}
