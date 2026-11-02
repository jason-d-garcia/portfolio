"use client";

import { useState } from "react";

/* The live demo loads only when asked, so the page never shows a blank iframe while a third-party app wakes up. */
export function DemoEmbed({ url, name, children }: { url: string; name: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <iframe
        src={`${url}?embed`}
        title={`${name} live demo`}
        className="h-[1400px] w-full bg-bg min-[820px]:h-[760px]"
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,32rem)_1fr] sm:items-end">
      <div>{children}</div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-12 items-center bg-ink px-6 font-sans text-base text-bg transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Load the live demo here
        </button>
        <a href={url} className="inline-flex h-12 items-center bg-bg px-6 font-sans text-base transition-transform hover:-translate-y-0.5">
          Open in a new tab ↗
        </a>
      </div>
    </div>
  );
}
