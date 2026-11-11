# Foto Joe — J.L. Robinson Imaging

Website for Joe Robinson, celebration and portrait photographer serving Chicago & the South Suburbs.

**Pages:** Home · Portfolio · Services · About · Book (+ a friendly 404)

## Working on it

```bash
npm install
npm run dev        # preview at http://localhost:5173
npm run build      # production build in dist/
```

- Business details and prices: `src/content/site.ts`
- Photos: drop JPGs in `photo-originals/`, list them in `src/content/photos.ts`, run `npm run photos`
- Design rules: `DESIGN.md` · Reference research: `reference/REFERENCES.md`

## Publishing

Cloudflare builds and publishes every push to the `main` branch automatically (`wrangler.jsonc`).
Changes are made on a separate branch first and merged to `main` only after Joe approves.
