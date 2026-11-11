// After `vite build`, writes a ready-to-read HTML file for every page so Google,
// link previews and slow phones see real content before any JavaScript runs.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
// Preload the fonts every page title uses, so headlines settle sooner.
const assets = await readdir(path.join(dist, 'assets'));
const preloads = assets
  .filter((f) => /^(fraunces-latin-opsz-normal|fraunces-latin-opsz-italic|manrope-latin-wght-normal)-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');
const template = (await readFile(path.join(dist, 'index.html'), 'utf8')).replace('<!--app-head-->', `${preloads}\n    <!--app-head-->`);
const { render, routes } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);

const page = (url) => {
  const { html, head } = render(url);
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
};

// The homepage starts fetching the intro straight away, so the pen starts writing sooner.
const introChunk = assets.find((f) => /^IntroPlayer-.*\.js$/.test(f));
const withIntro = (html) =>
  introChunk ? html.replace('</head>', `  <link rel="modulepreload" href="/assets/${introChunk}" />\n  </head>`) : html;

for (const url of routes) {
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`;
  await writeFile(path.join(dist, file), url === '/' ? withIntro(page(url)) : page(url));
  console.log(`prerendered ${url} -> ${file}`);
}
await writeFile(path.join(dist, '404.html'), page('/404'));
console.log('prerendered 404 -> 404.html');
await rm(path.join(root, 'dist-server'), { recursive: true, force: true });
