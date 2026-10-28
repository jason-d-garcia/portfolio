import { existsSync } from "node:fs";
import { join } from "node:path";

export const siteUrl = process.env.SITE_URL ?? "https://jasondgarcia.com";

// The resume link appears only once public/resume.pdf is added. Checked at build time.
export const hasResume = existsSync(join(process.cwd(), "public", "resume.pdf"));

export const nav = [
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
  ...(hasResume ? [{ label: "Resume", href: "/resume" }] : []),
];
