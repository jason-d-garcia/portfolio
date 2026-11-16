import sample from "@/content/demos/senti-sample.json";
import { ballroomBaselines, hookClusters } from "@/content/demos/results";

/*
 * One figure per project, drawn from the same data files the interactive charts use, so a preview can never show
 * a number the project page doesn't. Each takes its colour from --hue, set by <ProjectFigure>.
 */

type Row = [string, string, number, number, number];
const songs = sample.songs as Row[];

function SentiFigure() {
  const S = 200;
  const R = 0.8;
  const x = (v: number) => ((v / R + 1) / 2) * S;
  const y = (a: number) => ((1 - a / R) / 2) * S;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label={`${songs.length} songs from senti's map, plotted by how good and how energetic they feel.`} className="mx-auto block h-full max-h-[22rem] w-auto max-w-full">
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <circle key={r} cx={S / 2} cy={S / 2} r={(r * S) / 2} fill="none" stroke="var(--rule)" strokeWidth="0.5" />
      ))}
      <line x1={S / 2} y1="0" x2={S / 2} y2={S} stroke="var(--rule)" strokeWidth="0.5" />
      <line x1="0" y1={S / 2} x2={S} y2={S / 2} stroke="var(--rule)" strokeWidth="0.5" />
      {songs.map((s) => (
        <circle key={`${s[0]}-${s[1]}`} cx={x(s[3])} cy={y(s[4])} r="1.7" fill="var(--hue)" opacity="0.8" />
      ))}
      <g fontSize="5.5" fill="var(--muted)" fontFamily="var(--font-mono)" letterSpacing="0.04em">
        <text x={S - 3} y={S / 2 - 3} textAnchor="end">FEELS GOOD →</text>
        <text x="3" y={S / 2 - 3}>← FEELS BAD</text>
        <text x={S / 2 + 3} y="8">WIRED ↑</text>
        <text x={S / 2 + 3} y={S - 3}>CALM ↓</text>
      </g>
    </svg>
  );
}

function TikTokFigure() {
  const MIN = 0.6;
  const MAX = 1.9;
  const W = 320;
  const rows = hookClusters.clusters;
  const rowH = 15;
  const H = rows.length * rowH + 22;
  const x = (v: number) => ((v - MIN) / (MAX - MIN)) * W;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Twelve opening types ranked by views relative to the same creator's usual, each with a 95% interval. Five sit clearly above 1x." className="block w-full">
      {[0.75, 1, 1.25, 1.5, 1.75].map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1="0" y2={H - 16} stroke={t === 1 ? "var(--muted)" : "var(--rule)"} strokeWidth="0.75" />
          <text x={x(t)} y={H - 4} textAnchor="middle" fontSize="8" fill="var(--muted)" fontFamily="var(--font-mono)">{t}x</text>
        </g>
      ))}
      {rows.map((c, i) => {
        const cy = i * rowH + 9;
        const color = c.lo > 1 ? "var(--hue)" : "var(--muted)";
        return (
          <g key={c.id}>
            <line x1={x(c.lo)} x2={x(c.hi)} y1={cy} y2={cy} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx={x(c.lift)} cy={cy} r="3.2" fill={color} stroke="var(--surface)" strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
}

function BallroomFigure() {
  return (
    <div role="img" aria-label="Accuracy of six models on 618 held-out clips. MERT with a probe is highest at 95.6%." className="w-full space-y-2.5">
      {ballroomBaselines.map((b) => (
        <div key={b.model}>
          <div className="flex justify-between gap-3 font-mono text-[0.6875rem] leading-tight text-muted">
            <span className={`truncate ${b.main ? "text-ink" : ""}`}>{b.model}</span>
            <span className="tabular-nums">{b.acc}%</span>
          </div>
          <div className="mt-1 h-1.5 bg-rule/60">
            <div className="h-full" style={{ width: `${b.acc}%`, background: b.main ? "var(--hue)" : "var(--muted)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// The MAP-Elites archive, drawn empty on purpose: the search has not run at scale, so there is nothing to plot.
function VgcFigure() {
  const cols = 12;
  const rows = 7;
  const c = 22;
  const pulse = [17, 40, 58];
  return (
    <svg viewBox={`0 0 ${cols * c} ${rows * c}`} role="img" aria-label="An empty grid: the search archive, with one bin per play style. It is empty because the search has not run at scale yet." className="block w-full">
      {Array.from({ length: cols * rows }, (_, i) => {
        const cx = (i % cols) * c;
        const cy = Math.floor(i / cols) * c;
        const p = pulse.indexOf(i);
        return (
          <g key={i}>
            <rect x={cx + 2} y={cy + 2} width={c - 4} height={c - 4} fill="none" stroke="var(--rule)" strokeWidth="1" />
            {p >= 0 && <rect x={cx + 2} y={cy + 2} width={c - 4} height={c - 4} fill="var(--hue)" className="cell-pulse" style={{ animationDelay: `${p * 0.8}s` }} />}
          </g>
        );
      })}
    </svg>
  );
}

const figures: Record<string, { hue: string; caption: string; node: () => React.ReactNode }> = {
  moodify: {
    hue: "var(--hue-senti)",
    caption: `${songs.length} of the ${sample.catalogSize.toLocaleString("en-US")} songs on the live map, at the positions the model gave them.`,
    node: SentiFigure,
  },
  "tiktok-conformal": {
    hue: "var(--hue-tiktok)",
    caption: "12 opening types, views relative to the same creator's usual, with 95% intervals. 44,030 clips, 1,637 creators.",
    node: TikTokFigure,
  },
  "vgc-team-generation": {
    hue: "var(--hue-vgc)",
    caption: "Method sketch, not a result. The archive keeps one best team per play style, and it is empty until the search runs.",
    node: VgcFigure,
  },
  ballroom: {
    hue: "var(--hue-ballroom)",
    caption: "Accuracy on 618 held-out clips, same split for every model.",
    node: BallroomFigure,
  },
};

export const hasFigure = (slug: string) => slug in figures;
export const projectHue = (slug: string) => figures[slug]?.hue ?? "var(--accent)";

export function ProjectFigure({ slug, className = "" }: { slug: string; className?: string }) {
  const f = figures[slug];
  if (!f) return null;
  return (
    <figure className={`m-0 ${className}`} style={{ "--hue": f.hue } as React.CSSProperties}>
      <div className="flex aspect-[4/3] items-center justify-center bg-surface p-5 sm:p-8">{f.node()}</div>
      <figcaption className="mt-2.5 font-mono text-[0.6875rem] leading-snug text-muted">{f.caption}</figcaption>
    </figure>
  );
}
