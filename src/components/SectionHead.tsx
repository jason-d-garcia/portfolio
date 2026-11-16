/* "02 / Current explorations": the mono index and the display title that open each home-page section. */
export function SectionHead({ index, title, children }: { index: string; title: string; children?: React.ReactNode }) {
  return (
    <div data-reveal className="grid gap-4 border-t border-ink pt-4 sm:grid-cols-12 sm:gap-8">
      <p className="meta sm:col-span-3">
        <span className="text-accent-text">{index}</span> / {title}
      </p>
      {children && <div className="sm:col-span-9">{children}</div>}
    </div>
  );
}
