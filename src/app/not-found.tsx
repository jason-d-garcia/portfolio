import Link from "next/link";

export default function NotFound() {
  return (
    <section className="px-4 pt-16 pb-28 sm:px-8 sm:pt-24">
      <h1 className="text-[clamp(3rem,1.6rem+7vw,8.5rem)] leading-[0.92] tracking-[-0.03em]">Page not found</h1>
      <p className="mt-6 max-w-xl text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)] leading-snug">
        That page doesn&rsquo;t exist. Try the{" "}
        <Link href="/projects" className="underline underline-offset-4 hover:text-accent-text">projects</Link> or the{" "}
        <Link href="/" className="underline underline-offset-4 hover:text-accent-text">home page</Link>.
      </p>
    </section>
  );
}
