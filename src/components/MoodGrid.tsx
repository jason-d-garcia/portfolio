// Static valence/arousal plane used as the Moodify illustration until the live demo is embedded.
const quadrants = [
  { label: "Angry", x: 25, y: 25 },
  { label: "Happy", x: 75, y: 25 },
  { label: "Sad", x: 25, y: 75 },
  { label: "Relaxed", x: 75, y: 75 },
];

const dots = [
  [68, 20], [80, 34], [62, 31], [72, 12], [31, 18], [18, 30], [38, 36],
  [22, 70], [34, 82], [14, 64], [70, 72], [84, 66], [62, 86], [77, 88], [52, 44], [46, 58],
];

export function MoodGrid({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Valence and arousal mood plane with four quadrants">
      <rect x="0.5" y="0.5" width="99" height="99" fill="var(--paper-2)" stroke="var(--rule)" />
      <line x1="50" y1="4" x2="50" y2="96" stroke="var(--rule)" strokeWidth="0.4" />
      <line x1="4" y1="50" x2="96" y2="50" stroke="var(--rule)" strokeWidth="0.4" />
      {quadrants.map((q) => (
        <text key={q.label} x={q.x} y={q.y} textAnchor="middle" fontSize="4" fill="var(--ink-soft)" fontFamily="var(--font-mono)">
          {q.label.toUpperCase()}
        </text>
      ))}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="var(--ink-soft)" opacity="0.55" />
      ))}
      <circle cx="64" cy="36" r="9" fill="none" stroke="var(--accent)" strokeWidth="0.4" strokeDasharray="1 1" />
      <circle cx="64" cy="36" r="2.4" fill="var(--accent)" />
      <text x="50" y="99" textAnchor="middle" fontSize="2.6" fill="var(--ink-soft)" fontFamily="var(--font-mono)" dy="-1.5">VALENCE →</text>
      <text x="2.5" y="50" textAnchor="middle" fontSize="2.6" fill="var(--ink-soft)" fontFamily="var(--font-mono)" transform="rotate(-90 2.5 50)" dy="1">AROUSAL →</text>
    </svg>
  );
}
