import Link from "next/link";

const proofs = [
  { value: "3,000+", label: "math and programming lessons taught since 2020", href: "/#experience" },
  { value: "0.85", label: "arousal correlation with listeners, senti lyrics + audio model", href: "/projects/moodify" },
  { value: "91%", label: "conformal interval coverage at a 90% target, TikTok forecasting", href: "/projects/tiktok-conformal" },
  { value: "99.5–100%", label: "battle outcomes matching Showdown, VGC Rust engine", href: "/projects/vgc-team-generation" },
];

/* Four numbers with their sources one click away. Every value comes from projects.ts or profile.ts. */
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
