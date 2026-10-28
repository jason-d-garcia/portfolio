import Link from "next/link";
import { profile } from "@/content/profile";
import { nav } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="flex h-16 items-center justify-between gap-3 px-4 sm:px-8">
      <Link href="/" className="text-xl font-medium tracking-tight whitespace-nowrap hover:text-accent-text">
        {profile.name}
      </Link>
      <nav aria-label="Main" className="flex gap-3 text-base sm:gap-7">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="underline-offset-4 hover:text-accent-text hover:underline">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
