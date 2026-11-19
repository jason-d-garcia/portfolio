import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts, processNote } from "@/content/writing";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  // Drafts are readable by link but kept out of search results until Jason signs off on them.
  return { title: post.title, description: post.dek, robots: post.draft ? { index: false } : undefined };
}

export default async function PostPage({ params }: Params) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[(index + 1) % posts.length];

  return (
    <article className="frame">
      <header className="pt-10 pb-12 sm:pt-16 sm:pb-16">
        <p className="meta flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/writing" className="hover:text-ink">← Writing</Link>
          <span>{post.when}</span>
          {post.draft && <span className="text-accent-text">Draft</span>}
        </p>
        <h1 className="mt-6 max-w-[18ch] text-[clamp(2.5rem,1.5rem+4.6vw,5.25rem)] leading-[0.95] tracking-[-0.035em]">{post.title}</h1>
        <p className="voice mt-6 max-w-[32ch] text-[clamp(1.375rem,1.15rem+1vw,2rem)] leading-[1.2] text-accent-text">{post.dek}</p>
      </header>

      <div className="grid gap-4 border-t border-rule py-10 sm:grid-cols-12 sm:gap-8 sm:py-14">
        <p className="meta sm:col-span-3">{post.themes.join(" · ")}</p>
        <div className="min-w-0 max-w-[65ch] space-y-5 text-[1.0625rem] leading-relaxed sm:col-span-8">
          {post.body.map((b, i) => {
            if (typeof b === "string") return <p key={i}>{b}</p>;
            if ("h" in b) {
              return (
                <h2 key={i} className="pt-6 font-display text-[clamp(1.375rem,1.2rem+0.8vw,1.75rem)] leading-tight tracking-[-0.02em]">
                  {b.h}
                </h2>
              );
            }
            return (
              <figure key={i} className="border-l-2 border-accent py-1 pl-5">
                <blockquote className="voice text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] leading-snug">{b.quote}</blockquote>
                <figcaption className="meta mt-3 normal-case tracking-normal">{b.cite}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 border-t border-rule py-10 sm:grid-cols-12 sm:gap-8">
        <p className="meta sm:col-span-3">How this was written</p>
        <div className="max-w-[65ch] space-y-4 sm:col-span-8">
          <p className="text-[0.9375rem] leading-snug text-muted">{processNote}</p>
          {post.related && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {post.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="link">{r.label} →</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {next.slug !== post.slug && (
        <Link href={`/writing/${next.slug}`} className="group grid gap-2 border-t border-ink pt-4 pb-24 sm:grid-cols-12 sm:gap-8">
          <span className="meta sm:col-span-3">Next essay</span>
          <span className="font-display text-[clamp(1.75rem,1.3rem+2vw,3rem)] leading-none tracking-[-0.03em] group-hover:text-accent-text sm:col-span-9">
            {next.title} →
          </span>
        </Link>
      )}
    </article>
  );
}
