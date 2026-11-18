import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Shared Open Graph card: paper, ink and the one accent, with five staff lines under the title.
export function ogImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f5f1e8", color: "#1c1a17", padding: "64px" }}>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 2, color: "#655f55" }}>JASON GARCIA · AI / ML · MATHEMATICS · CREATIVE TECHNOLOGY</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, letterSpacing: -4, lineHeight: 1 }}>{title}</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 34, lineHeight: 1.3, maxWidth: 940, color: "#655f55" }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", height: 1, marginTop: 14, background: i === 2 ? "#b5451b" : "#d6cebd" }} />
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
