import Link from "next/link";
import { profile } from "@/content/profile";

/* Every page ends here: the ask, the ways to reach me, the copyright line. */
export function SiteFooter() {
  const contacts = [
    { label: "Email", href: profile.links.email && `mailto:${profile.links.email}` },
    { label: "GitHub", href: profile.links.github },
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "Resume", href: "/resume" },
  ].filter((c) => c.href);

  return (
    <footer id="contact" className="scroll-mt-4 border-t border-rule">
      <div className="frame grid gap-10 pt-14 pb-8 sm:grid-cols-12 sm:pt-20">
        <div className="sm:col-span-7">
          <p className="meta">Contact</p>
          <p className="mt-4 max-w-[24ch] font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] leading-[1.05] tracking-[-0.02em]">
            Building something for learners, or hiring for <span className="voice">Summer 2027?</span>
          </p>
          <p className="mt-4 max-w-md text-muted">I&rsquo;d like to hear from you.</p>
        </div>
        <ul className="flex flex-col gap-2 text-lg sm:col-span-5 sm:items-end sm:justify-end">
          {contacts.map((c) => (
            <li key={c.label}>
              {c.href.startsWith("/") ? (
                <Link href={c.href} className="link">{c.label}</Link>
              ) : (
                <a href={c.href} className="link">{c.label}</a>
              )}
            </li>
          ))}
        </ul>
        <div className="meta flex justify-between gap-4 border-t border-rule pt-5 sm:col-span-12">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#top" className="hover:text-ink">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
