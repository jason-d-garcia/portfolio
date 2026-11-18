import { existsSync } from "node:fs";
import { join } from "node:path";

export const siteUrl = process.env.SITE_URL ?? "https://jasondgarcia.com";

// The PDF download on /resume appears only once public/resume.pdf is added. Checked at build time.
export const hasResume = existsSync(join(process.cwd(), "public", "resume.pdf"));

export const nav: { label: string; short?: string; href: string }[] = [
  { label: "Projects", href: "/projects" },
  { label: "Explorations", short: "Explore", href: "/explorations" },
  { label: "Beyond the Code", short: "Beyond", href: "/beyond" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
];
