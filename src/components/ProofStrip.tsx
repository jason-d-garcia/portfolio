import Link from "next/link";
import { getProject } from "@/content/projects";

/* Four numbers with their sources one click away. Project values are read from projects.ts by metric label,
   so a number can only change in one place; the lessons count is the one figure that lives in profile.ts copy. */
const metric = (slug: string, label: string) => {
  const value = getProject(slug)?.metrics.find((m) => m.label === label)?.value;
  if (!value) throw new Error(`ProofStrip: no metric "${label}" on project "${slug}"`);
  // "0.57 → 0.85" style values show their final number.
  return value.split("→").pop()!.trim();
};

const proofs = [
  { value: "3,000+", label: "math and programming lessons taught since 2020", href: "/#experience" },
  { value: metric("moodify", "Arousal vs listeners"), label: "arousal correlation with listeners, senti lyrics + audio model", href: "/projects/moodify" },
  { value: metric("tiktok-conformal", "Interval coverage"), label: "conformal interval coverage at a 90% target, TikTok forecasting", href: "/projects/tiktok-conformal" },
  { value: metric("vgc-team-generation", "Engine agreement with Showdown"), label: "battle outcomes matching Showdown, VGC Rust engine", href: "/projects/vgc-team-generation" },
];

export function ProofStrip() {
  return (
    <ul data-reveal className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-surface py-8 sm:grid-cols-4 sm:gap-x-10 sm:py-10">
      {proofs.map((p) => (
        <li key={p.label}>
          <Link href={p.href} className="group block">
            <span className="block text-[clamp(2rem,1.3rem+2.4vw,3rem)] leading-none tracking-[-0.02em] tabular-nums transition-colors group-hover:text-accent-text">
              {p.value}
            </span>
            <span className="mt-2 block max-w-[22ch] font-sans text-sm leading-snug text-muted">{p.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
