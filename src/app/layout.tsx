import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { profile } from "@/content/profile";
import "./globals.css";

const serif = Fraunces({ variable: "--font-face", subsets: ["latin"], axes: ["opsz"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description: profile.summary,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" id="top">
      <body className={`${serif.variable} antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-bg focus:p-2">
          Skip to content
        </a>
        <div className="flex min-h-svh flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Reveal />
      </body>
    </html>
  );
}
