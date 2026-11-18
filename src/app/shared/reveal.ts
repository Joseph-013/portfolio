import { DOCUMENT } from '@angular/common';
import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

/** Fades and lifts the element into view the first time it scrolls on screen. */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'motion-safe:transition-[opacity,translate] motion-safe:duration-[620ms] motion-safe:ease-[cubic-bezier(.2,.7,.2,1)]',
  },
})
export class Reveal {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const win = inject(DOCUMENT).defaultView;

    afterNextRender(() => {
      const reduceMotion = win?.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion || !win || !('IntersectionObserver' in win)) return;

      // Anything already on screen stays visible; only below-the-fold content animates in.
      if (el.getBoundingClientRect().top < win.innerHeight * 0.9) return;

      el.style.opacity = '0';
      el.style.translate = '0 16px';
      const show = () => {
        el.style.opacity = '1';
        el.style.translate = '0 0';
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            show();
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
      );
      observer.observe(el);
    });
  }
}
