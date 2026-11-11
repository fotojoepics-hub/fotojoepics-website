// Tiny bridge between the signature intro and the page underneath it,
// so the homepage can start its entrance exactly as the intro bursts open.
const listeners = new Set<() => void>();
let pending =
  typeof document !== 'undefined' && document.documentElement.classList.contains('intro');

export function introPending() {
  return pending;
}

export function markIntroDone() {
  if (!pending) return;
  pending = false;
  for (const fn of listeners) fn();
  listeners.clear();
}

/** Runs `fn` now if no intro is playing, otherwise when it opens. Returns an unsubscribe. */
export function whenIntroDone(fn: () => void) {
  if (!pending) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
