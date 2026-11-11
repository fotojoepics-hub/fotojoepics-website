// Turns the photos in photo-originals/ into fast, web-ready sizes.
//
//   npm run photos            (only encodes photos that are new)
//   npm run photos -- --force (re-encodes everything)
//
// For every JPG it writes AVIF + WebP files at a few widths into public/photos/
// and records each photo's size and average colour in src/content/photos.gen.json.
// All camera/location metadata is stripped (sharp drops it by default).
import { access, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'photo-originals');
const outDir = path.join(root, 'public/photos');
const WIDTHS = [480, 800, 1200, 1600];
const force = process.argv.includes('--force');

// Extra crops made from an original: { name: { from, region: [left, top, width, height] as 0..1 } }
const CROPS = {
  // the room without the welcome screens (they show a client's name and photos)
  'reception-room-hero': { from: 'reception-room-gold-chairs-candelabras', region: [0, 0.27, 1, 0.73] },
};
// Social-share image (1200x630) shown when the site is linked in texts and posts
const OG = { from: 'reception-room-hero' };

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

async function averageColor(input) {
  const { data } = await input.clone().resize(1, 1, { fit: 'cover' }).raw().toBuffer({ resolveWithObject: true });
  return '#' + [data[0], data[1], data[2]].map((v) => Math.round(v * 0.6).toString(16).padStart(2, '0')).join('');
}

async function encode(name, input) {
  const meta = await input.clone().metadata();
  const widths = WIDTHS.filter((w) => w < meta.width).concat(meta.width);
  for (const w of widths) {
    const avif = path.join(outDir, `${name}-${w}.avif`);
    const webp = path.join(outDir, `${name}-${w}.webp`);
    if (!force && (await exists(avif)) && (await exists(webp))) continue;
    const resized = input.clone().resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 52, effort: 4 }).toFile(avif);
    await resized.clone().webp({ quality: 76, effort: 5 }).toFile(webp);
  }
  return { w: meta.width, h: meta.height, widths, color: await averageColor(input) };
}

if (force) await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const manifest = {};
const files = (await readdir(srcDir)).filter((f) => /\.jpe?g$/i.test(f)).sort();
for (const file of files) {
  const name = file.replace(/\.jpe?g$/i, '');
  manifest[name] = await encode(name, sharp(path.join(srcDir, file)).rotate());
}
const buffers = {};
for (const [name, { from, region }] of Object.entries(CROPS)) {
  const source = sharp(path.join(srcDir, `${from}.jpg`)).rotate();
  const meta = await source.metadata();
  const [l, t, w, h] = region;
  buffers[name] = await source
    .extract({
      left: Math.round(l * meta.width),
      top: Math.round(t * meta.height),
      width: Math.round(w * meta.width),
      height: Math.round(h * meta.height),
    })
    .jpeg({ quality: 96 })
    .toBuffer();
  manifest[name] = await encode(name, sharp(buffers[name]));
}

const ogSource = buffers[OG.from] ?? (await sharp(path.join(srcDir, `${OG.from}.jpg`)).toBuffer());
await sharp(ogSource)
  .resize(1200, 630, { fit: 'cover' })
  .modulate({ brightness: 0.9 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(root, 'public/og.jpg'));

await writeFile(path.join(root, 'src/content/photos.gen.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Processed ${Object.keys(manifest).length} photos into public/photos`);
