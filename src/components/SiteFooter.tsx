import Link from "next/link";
import { profile } from "@/content/profile";
import { hasResume } from "@/lib/site";

/* The contact block. Every page ends here, so it stays short: the ask, four ways to reach me, the copyright line. */
export function SiteFooter() {
  const contacts = [
    { label: profile.links.email, href: profile.links.email && `mailto:${profile.links.email}`, external: false },
    { label: "GitHub", href: profile.links.github, external: true },
    { label: "LinkedIn", href: profile.links.linkedin, external: true },
    { label: "Resume (PDF)", href: hasResume ? "/resume" : "", external: false },
  ].filter((c) => c.href);

  return (
    <footer id="contact" className="scroll-mt-4 bg-[#191919] px-4 pt-16 pb-8 text-white sm:px-8 sm:pt-20">
      <div className="grid gap-10 sm:grid-cols-12 sm:items-end">
        <div className="sm:col-span-7">
          <p className="text-[clamp(2rem,1.4rem+2.4vw,3rem)] leading-none tracking-[-0.02em]">{profile.name}</p>
          <p className="mt-5 max-w-md text-[1.125rem] leading-snug text-[#c9c9c9] sm:text-[1.25rem]">
            Hiring for Summer 2027, or working on learning tools? I&rsquo;d like to hear from you.
          </p>
        </div>
        <ul className="flex flex-col gap-2 font-sans text-lg sm:col-span-5 sm:items-end sm:text-right">
          {contacts.map((c) =>
            c.external || c.href.startsWith("mailto:") ? (
              <li key={c.label}>
                <a href={c.href} className="text-field-4 underline-offset-4 hover:underline">
                  {c.label}
                </a>
              </li>
            ) : (
              <li key={c.label}>
                <Link href={c.href} className="text-field-4 underline-offset-4 hover:underline">
                  {c.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="mt-14 flex justify-between gap-4 border-t border-white/15 pt-5 font-sans text-sm text-[#c9c9c9]">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href="#top" className="hover:text-white hover:underline">Back to top</a>
      </div>
    </footer>
  );
}
