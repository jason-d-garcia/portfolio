import type { Metadata } from "next";
import Link from "next/link";
import { DraftCompare } from "@/components/creator-studio/DraftCompare";

export const metadata: Metadata = {
  title: "Draft comparison",
  description: "Compare versions of a TikTok post before publishing: predicted view ranges, ties the model can't separate, and feedback on each version.",
};

export default function CreatorStudioPage() {
  return (
    <article className="px-4 pt-10 pb-16 sm:px-8 sm:pt-14">
      <header className="mb-8 max-w-[70ch]">
        <Link href="/projects/tiktok-conformal" className="text-muted underline-offset-4 hover:text-ink hover:underline">
          ← TikTok forecasting
        </Link>
        <h1 className="mt-6 text-[clamp(2.5rem,1.6rem+4vw,5rem)] leading-[0.95] tracking-[-0.03em]">Draft comparison</h1>
        <p className="mt-4 text-lg">
          Write two to six versions of a post and see how each is likely to do, as a range rather than a single number. Versions that are too close to call are shown as tied.
        </p>
        <p className="mt-2 text-muted">
          Predictions come from a simple placeholder for now: your typical views plus a few hand-set nudges. The 80% ranges are wide, about 4x either way, and were calibrated on one creator&apos;s past posts. The trained forecasting model from this project will take its place.
        </p>
      </header>
      <DraftCompare />
      <p className="mt-10 max-w-[70ch] font-sans text-xs text-muted">Everything runs in your browser. Nothing you type is sent anywhere.</p>
    </article>
  );
}
