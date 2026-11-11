# FotoJoe Pics website — notes for future sessions

Owner: Joe L. Robinson Jr. (“Foto Joe”, J.L. Robinson Imaging) — celebration & portrait photographer, **Chicago & the South Suburbs**, available for travel. Not a programmer: explain in plain language.

## Stack
- React 19 + TypeScript + Tailwind 4, built with Vite. Routing: wouter.
- GSAP (ScrollTrigger, SplitText, Flip) + Lenis for scroll; `motion/react` (LazyMotion `m.*`) for UI only.
- Every page is pre-rendered to HTML at build (`scripts/prerender.mjs`) and then hydrated.
- Hosting: Cloudflare Worker `fotojoepics-website` serving `./dist` (`wrangler.jsonc`). Cloudflare builds and deploys **every push to `main`** — work on a branch, merge only when Joe says go.

## Commands
- `npm run dev` — local preview
- `npm run build` — production build into `dist/`
- `npm run photos` — turn `photo-originals/*.jpg` into AVIF/WebP sizes + `src/content/photos.gen.json`
- `npx tsc --noEmit -p .` — type-check
- `vite build --mode artifact --outDir dist-artifact` — self-contained preview copy (hash routes)

## Rules
- Follow `DESIGN.md`. Business facts and prices live in `src/content/site.ts` only.
- Only Joe’s real photos; no client names in captions; confirm permission for featured clients (and especially minors — none are used right now).
- Never invent reviews, prices, stats or awards. Gaps are `TODO(Joe)` comments.
- Animate transform/opacity/clip-path only; every effect needs a phone and reduced-motion version.

## Open TODOs for Joe
- Curated portfolio photos (full-resolution originals) and a portrait of Joe for About.
- Wedding photos (the Weddings sections currently show a couple from a Sweet 16, captioned honestly).
- Inquiry delivery: Cloudflare Worker + Turnstile + email (form currently opens the visitor’s email app).
- Retainer %, gallery turnaround, add-on prices. Domain (fotojoepics.com) → then canonical/OG URLs.
- Optional Higgsfield ambient film (needs Joe’s OK and credits).
