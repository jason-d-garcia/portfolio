import { profile } from "@/content/profile";

/* Experience and education as a two-column record. Used on /about and /resume. */
export function Record() {
  return (
    <>
      <section id="experience" className="grid scroll-mt-6 gap-4 border-t border-ink pt-4 sm:grid-cols-12 sm:gap-8">
        <h2 className="meta sm:col-span-3">Experience</h2>
        <ul className="sm:col-span-9">
          {profile.experience.map((e) => (
            <li key={e.org} className="grid gap-x-8 gap-y-1 border-b border-rule py-5 first:pt-0 sm:grid-cols-[1fr_9rem]">
              <div>
                <p className="font-display text-xl leading-tight tracking-[-0.01em]">{e.org}</p>
                <p className="mt-0.5 text-muted">{e.role}</p>
                <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-snug">{e.detail}</p>
              </div>
              <p className="meta sm:pt-1.5 sm:text-right">{e.when}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-16 grid gap-4 border-t border-ink pt-4 sm:grid-cols-12 sm:gap-8">
        <h2 className="meta sm:col-span-3">Education</h2>
        <ul className="sm:col-span-9">
          {profile.education.map((e) => (
            <li key={e.degree} className="grid gap-x-8 gap-y-1 border-b border-rule py-5 first:pt-0 sm:grid-cols-[1fr_14rem]">
              <div>
                <p className="font-display text-xl leading-tight tracking-[-0.01em]">{e.degree}</p>
                <p className="mt-0.5 text-muted">{e.school}</p>
              </div>
              <p className="meta sm:pt-1.5 sm:text-right">{e.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
