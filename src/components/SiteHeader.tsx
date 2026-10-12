import Link from "next/link";
import { profile } from "@/content/profile";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-rule py-5">
      <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
        {profile.name}
      </Link>
      <nav className="flex gap-5 font-mono text-xs uppercase tracking-widest text-ink-soft">
        <Link href="/#work" className="hover:text-ink">Work</Link>
        <Link href="/#about" className="hover:text-ink">About</Link>
        <a href={profile.links.github} className="hover:text-ink">GitHub</a>
        <a href={profile.links.linkedin} className="hover:text-ink">LinkedIn</a>
      </nav>
    </header>
  );
}
