import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/content/profile";
import { nav } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="frame flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
        <Link href="/" className="font-display text-lg font-medium tracking-tight whitespace-nowrap hover:text-accent-text">
          {profile.name}
        </Link>
        {/* On phones the toggle sits beside the name, so the six nav links fit on one line. */}
        <div className="sm:hidden"><ThemeToggle /></div>
        <div className="flex min-w-0 items-center gap-3 max-sm:w-full max-sm:justify-between">
          <nav aria-label="Main" className="flex min-w-0 flex-wrap gap-x-2 gap-y-1 text-[0.8125rem] max-sm:w-full max-sm:justify-between sm:gap-x-6 sm:text-[0.9375rem]">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap underline-offset-4 hover:text-accent-text hover:underline">
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
          <div className="max-sm:hidden"><ThemeToggle /></div>
        </div>
      </div>
    </header>
  );
}
