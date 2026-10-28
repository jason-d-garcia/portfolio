import Link from "next/link";
import { profile } from "@/content/profile";
import { nav } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 sm:h-16 sm:flex-nowrap sm:px-8 sm:py-0">
      <Link href="/" className="text-xl font-medium tracking-tight whitespace-nowrap hover:text-accent-text">
        {profile.name}
      </Link>
      <nav aria-label="Main" className="flex gap-3 text-base sm:gap-7">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="underline-offset-4 hover:text-accent-text hover:underline">
            {n.short ? (
              <>
                <span className="sm:hidden">{n.short}</span>
                <span className="hidden sm:inline">{n.label}</span>
              </>
            ) : (
              n.label
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
