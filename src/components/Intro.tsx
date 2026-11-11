import { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { markIntroDone } from '../lib/intro';

const IntroPlayer = lazy(() => import('./IntroPlayer'));

/**
 * The opening: a black screen, "Foto Joe" writes itself in gold, the camera clicks,
 * then the signature flies up into the header while a handful of Joe's photos burst
 * outward and the homepage appears. About 2.6s, once per visit, skippable with any
 * click, tap, key or scroll. Never shown with reduced motion or on inner pages.
 */
export function Intro() {
  const [active, setActive] = useState(false);
  useLayoutEffect(() => {
    if (document.documentElement.classList.contains('intro')) setActive(true);
    else markIntroDone();
  }, []);
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <IntroPlayer onDone={() => setActive(false)} />
    </Suspense>
  );
}
