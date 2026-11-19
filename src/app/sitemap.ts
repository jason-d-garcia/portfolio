import type { MetadataRoute } from "next";
import { projectPages } from "@/content/projects";
import { posts } from "@/content/writing";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/projects", "/explorations", "/writing", "/beyond", "/about", "/resume", "/vgc", "/creator-studio", ...projectPages.map((p) => `/projects/${p.slug}`), ...posts.filter((p) => !p.draft).map((p) => `/writing/${p.slug}`)];
  return paths.map((p) => ({ url: `${siteUrl}${p}` }));
}
