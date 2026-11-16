import Link from "next/link";

export default function NotFound() {
  return (
    <section className="frame pt-16 pb-28 sm:pt-24">
      <h1 className="text-[clamp(2.5rem,1.4rem+5vw,5.5rem)] leading-[0.95] tracking-[-0.035em]">Page not found</h1>
      <p className="mt-6 max-w-xl text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)] leading-snug">
        That page doesn&rsquo;t exist. Try the{" "}
        <Link href="/projects" className="underline underline-offset-4 hover:text-accent-text">projects</Link> or the{" "}
        <Link href="/" className="underline underline-offset-4 hover:text-accent-text">home page</Link>.
      </p>
    </section>
  );
}
