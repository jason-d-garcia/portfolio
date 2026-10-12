# Portfolio

Live: https://portfolio-phi-mauve-73.vercel.app/

Personal portfolio site: Next.js (App Router), TypeScript, Tailwind CSS v4, deployed on Vercel.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build
```

## Content

- `src/content/profile.ts` — name, summary, education, experience, links.
- `src/content/projects.ts` — one entry per project; each renders at `/projects/<slug>`.

To embed a live demo, set the project's `demoUrl`. Leave a metric's `value` empty until it comes from a reproducible run, and say where it came from in `source`.
