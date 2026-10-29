import type { Metadata } from "next";
import Link from "next/link";
import { TeamBuilder } from "@/components/vgc/TeamBuilder";

export const metadata: Metadata = {
  title: "VGC team builder",
  description: "Build a Pokémon Champions VGC Regulation M-B team: drag Pokémon into six slots, lock the ones you want to keep, edit sets, and check type matchups.",
};

export default function VgcPage() {
  return (
    <article className="px-4 pt-10 pb-16 sm:px-8 sm:pt-14">
      <header className="mb-8 max-w-[70ch]">
        <Link href="/projects/vgc-team-generation" className="text-muted underline-offset-4 hover:text-ink hover:underline">
          ← VGC team generation
        </Link>
        <h1 className="mt-6 text-[clamp(2.5rem,1.6rem+4vw,5rem)] leading-[0.95] tracking-[-0.03em]">Team builder</h1>
        <p className="mt-4 text-lg">
          Pokémon Champions, VGC 2026 Regulation M-B. Pick six, lock the ones you want to keep, and ask for suggestions to fill the rest.
        </p>
        <p className="mt-2 text-muted">
          Suggestions come from a simple placeholder for now. The genetic search from this project will take its place and score teams by simulated battles.
        </p>
      </header>
      <TeamBuilder />
      <p className="mt-10 max-w-[70ch] font-sans text-xs text-muted">
        Legal Pokémon, moves, items and abilities come from Pokémon Showdown&apos;s Champions data. Sprites are served by Pokémon Showdown. Pokémon is © Nintendo, Game Freak and The Pokémon Company; this is a fan project.
      </p>
    </article>
  );
}
