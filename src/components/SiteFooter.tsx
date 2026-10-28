import { profile } from "@/content/profile";

export function SiteFooter() {
  const contacts = [
    { label: "GitHub", href: profile.links.github },
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "Email", href: profile.links.email && `mailto:${profile.links.email}` },
  ].filter((c) => c.href);

  return (
    <footer id="contact" className="scroll-mt-4 overflow-hidden bg-[#191919] px-4 pt-20 pb-10 text-white sm:px-8 sm:pt-28">
      <p className="text-[clamp(3.5rem,12.5vw,13rem)] leading-[0.9] font-normal tracking-[-0.03em] whitespace-nowrap">
        {profile.name}
      </p>
      <div className="mt-16 grid gap-12 sm:mt-20 sm:grid-cols-12">
        <div className="sm:col-span-6">
          <p className="max-w-md text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)] leading-snug text-[#c9c9c9]">
            Hiring for Summer 2027, or working on learning tools? I&rsquo;d like to hear from you.
          </p>
          <ul className="mt-8 space-y-2">
            {contacts.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="text-[clamp(2rem,1.3rem+3.2vw,3rem)] leading-tight text-field-4 underline-offset-8 transition-transform hover:underline active:translate-y-px"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-24 flex justify-between gap-4 text-sm text-[#c9c9c9]">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href="#top" className="hover:text-white hover:underline">Back to top</a>
      </div>
    </footer>
  );
}
