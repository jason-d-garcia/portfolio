import { profile } from "@/content/profile";

export function SiteFooter() {
  const contacts = [
    { label: "GitHub", href: profile.links.github },
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "Email", href: profile.links.email && `mailto:${profile.links.email}` },
  ].filter((c) => c.href);

  return (
    <footer className="mt-24 flex flex-col gap-3 border-t border-rule py-8 font-mono text-xs text-ink-soft sm:flex-row sm:justify-between">
      <span>© {new Date().getFullYear()} {profile.name}</span>
      <span className="flex gap-5">
        {contacts.map((c) => (
          <a key={c.label} href={c.href} className="hover:text-ink">{c.label}</a>
        ))}
      </span>
    </footer>
  );
}
