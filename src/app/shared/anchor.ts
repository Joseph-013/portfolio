import { DOCUMENT } from '@angular/common';
import { inject, Service, signal } from '@angular/core';

let initialId = '';

/**
 * Reads the URL hash (e.g. /#tigerorgs), keeps the id, and removes it from the URL.
 * Call before bootstrap, while the target elements don't exist yet, so the browser never jumps.
 */
export function captureInitialAnchor(): void {
  initialId = readHash();
  if (location.hash) stripHash();
}

/**
 * In-page navigation without `#` in the URL. Same-page `#id` links and manual hash edits are
 * intercepted, the hash is stripped, and the id is exposed as `target` for scrolling/highlighting.
 */
@Service()
export class Anchor {
  private readonly document = inject(DOCUMENT);

  /** Id of the section or project the visitor navigated to; '' when none. */
  readonly target = signal(initialId);

  constructor() {
    const win = this.document.defaultView;
    this.document.addEventListener('click', (event) => this.onClick(event));
    // Fallback for hashes typed into the address bar after load.
    win?.addEventListener('hashchange', () => {
      const id = readHash();
      stripHash();
      if (id) this.go(id);
    });
  }

  /** Scroll to `id` and make it the current target. */
  go(id: string, behavior: ScrollBehavior = 'smooth'): void {
    const el = this.document.getElementById(id);
    if (!el) return;
    this.target.set(id);

    const reduceMotion = this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Cards are centered; sections align to the top (their scroll-margin clears the sticky bar).
    el.scrollIntoView({
      behavior: reduceMotion ? 'auto' : behavior,
      block: el.tagName === 'ARTICLE' ? 'center' : 'start',
    });

    // Keep keyboard/screen-reader position in step with the scroll, as a native anchor jump would.
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  private onClick(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
    const id = link ? decodeURIComponent(link.getAttribute('href')!.slice(1)) : '';
    if (!id || !this.document.getElementById(id)) return;

    event.preventDefault();
    this.go(id);
  }
}

function readHash(): string {
  return decodeURIComponent(location.hash.slice(1));
}

function stripHash(): void {
  history.replaceState(history.state, '', location.pathname + location.search);
}
