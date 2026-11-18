import type { MetadataRoute } from "next";
import { projectPages } from "@/content/projects";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/projects", "/explorations", "/beyond", "/about", "/resume", "/vgc", "/creator-studio", ...projectPages.map((p) => `/projects/${p.slug}`)];
  return paths.map((p) => ({ url: `${siteUrl}${p}` }));
}
