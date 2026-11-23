"use client";

import Link from "next/link";
import { useState } from "react";
import { influences, type Emblem } from "@/content/influences";

/*
 * A small portrait hall. Each frame holds a line drawing that stands for the person; picking a frame opens the
 * quote and the story beside it. The first portrait is open on load, so the section reads without any clicking.
 */

// Line drawings in the site's ink and accent. Each is the idea the person stands for, not a likeness.
function EmblemArt({ kind }: { kind: Emblem }) {
  if (kind === "swan") {
    return (
      <svg viewBox="0 0 120 150" className="h-full w-full" aria-hidden>
        <g stroke="var(--rule)" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M14 118h92M26 128h68M42 138h36" />
        </g>
        <path d="M32 104c0-17 26-24 52-15 14 5 17 19 5 23H42c-6 0-10-3-10-8Z" fill="var(--ink)" />
        <path d="M42 100C29 81 31 61 45 51c8-6 11-14 6-20" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="51" cy="30" r="6.5" fill="var(--ink)" />
        <path d="M56 27l12 4-12 4Z" fill="var(--accent)" />
      </svg>
    );
  }
  if (kind === "book") {
    return (
      <svg viewBox="0 0 120 150" className="h-full w-full" aria-hidden>
        <g stroke="var(--rule)" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M14 122h92M30 132h60" />
        </g>
        <path d="M60 50C48 42 32 40 18 44v60c14-4 30-2 42 6Z" fill="var(--ink)" />
        <path d="M60 50c12-8 28-10 42-6v60c-14-4-30-2-42 6Z" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        <g stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M70 60c8-4 16-5 24-4M70 72c8-4 16-5 24-4M70 84c8-4 16-5 24-4" />
        </g>
        <path d="M82 42v34l5-5 5 5V41Z" fill="var(--accent)" />
      </svg>
    );
  }
  if (kind === "hours") {
    return (
      <svg viewBox="0 0 120 150" className="h-full w-full" aria-hidden>
        <g stroke="var(--rule)" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M14 128h92" />
        </g>
        <circle cx="60" cy="72" r="38" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        {/* Nine to five, the long way round. */}
        <path d="M30 72A30 30 0 1 1 75 98" fill="none" stroke="var(--accent)" strokeWidth="7" strokeLinecap="round" />
        <path d="M60 72V50" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M60 72l-16 0" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" />
        <circle cx="60" cy="72" r="4" fill="var(--ink)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full" aria-hidden>
      <g stroke="var(--rule)" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M14 126h92" />
      </g>
      {/* The partner, standing; the dancer, tilted by the turn. */}
      <circle cx="74" cy="52" r="8" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M74 62v40" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="44" cy="46" r="8" fill="var(--ink)" />
      <path d="M46 56l10 46" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" />
      <path d="M30 112c22 16 58 14 74-10" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M104 102l-1 12-10-6Z" fill="var(--accent)" />
    </svg>
  );
}

export function PortraitHall() {
  const [openId, setOpenId] = useState(influences[0]?.id);
  const open = influences.find((p) => p.id === openId) ?? influences[0];
  if (!open) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <ul className="grid grid-cols-2 gap-5 self-start sm:grid-cols-3 lg:col-span-5 lg:grid-cols-2">
        {influences.map((p) => {
          const active = p.id === open.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setOpenId(p.id)}
                aria-pressed={active}
                aria-controls="portrait-plate"
                className="group block w-full text-left"
              >
                {/* Frame, mat, picture. */}
                <span className={`block border p-1.5 transition-colors ${active ? "border-accent" : "border-ink group-hover:border-accent"}`}>
                  <span className={`block border bg-surface p-4 transition-colors ${active ? "border-accent" : "border-rule"}`}>
                    <span className="block aspect-[4/5]">
                      <EmblemArt kind={p.emblem} />
                    </span>
                  </span>
                </span>
                <span className={`mt-3 block font-display text-lg leading-tight tracking-[-0.01em] ${active ? "text-accent-text" : "group-hover:text-accent-text"}`}>
                  {p.name}
                </span>
                <span className="meta mt-1 block normal-case tracking-normal">{[p.role, p.years].filter(Boolean).join(" · ")}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div id="portrait-plate" aria-live="polite" className="lg:col-span-7">
        <p className="meta">{open.name}</p>
        <figure className="mt-3">
          <blockquote className="voice max-w-[26ch] text-[clamp(1.5rem,1.2rem+1.4vw,2.375rem)] leading-[1.15]">&ldquo;{open.quote}&rdquo;</blockquote>
          <figcaption className="meta mt-3 normal-case tracking-normal">{open.source}</figcaption>
        </figure>
        <div className="mt-6 max-w-[58ch] space-y-4 text-[0.9375rem] leading-snug">
          {open.story.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
        <p className="mt-5 max-w-[58ch] text-[0.8125rem] leading-snug text-muted">In the frame: {open.emblemNote}</p>
        {open.link && (
          <p className="mt-4 text-[0.9375rem]">
            <Link href={open.link.href} className="link">{open.link.label} →</Link>
          </p>
        )}
      </div>
    </div>
  );
}
