import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { headTags } from './lib/seo';

export const routes = ['/', '/portfolio', '/services', '/about', '/book'];

export function render(path: string) {
  const html = renderToString(
    <StrictMode>
      <App ssrPath={path} />
    </StrictMode>,
  );
  return { html, head: headTags(path) };
}
