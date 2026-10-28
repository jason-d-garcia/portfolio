import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { hasResume, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/projects", "/research", "/about", ...projects.map((p) => `/projects/${p.slug}`)];
  if (hasResume) paths.push("/resume.pdf");
  return paths.map((p) => ({ url: `${siteUrl}${p}` }));
}
