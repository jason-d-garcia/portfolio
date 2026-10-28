import type { Metadata } from "next";
import { ProjectList } from "@/components/ProjectList";

export const metadata: Metadata = {
  title: "Projects",
  description: "Applied ML projects by Jason Garcia, each labelled as shipped, in progress or a concept.",
};

export default function ProjectsPage() {
  return (
    <section className="px-4 pt-16 pb-28 sm:px-8 sm:pt-24">
      <h1 className="text-[clamp(3rem,1.6rem+7vw,8.5rem)] leading-[0.92] tracking-[-0.03em]">Projects</h1>
      <p className="mt-6 max-w-xl text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)] leading-snug">
        Two shipped, two in progress and one idea. In-progress work shows what&rsquo;s done and what isn&rsquo;t, with no results until there are some.
      </p>
      <div className="mt-16">
        <ProjectList />
      </div>
    </section>
  );
}
