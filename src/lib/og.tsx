import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Shared Open Graph card: the site's two colour fields with a title across the seam.
export function ogImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#f2f2f0" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", padding: "0 64px 24px", fontSize: 96, color: "#0c7866", letterSpacing: -3 }}>
          {title}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffe927", padding: "32px 64px 48px", color: "#111111" }}>
          <div style={{ fontSize: 34, lineHeight: 1.3, maxWidth: 900 }}>{subtitle}</div>
          <div style={{ fontSize: 28 }}>Jason Garcia · jasondgarcia.com</div>
        </div>
      </div>
    ),
    ogSize,
  );
}
