import { Component, computed, input } from '@angular/core';
import { parseInlineLinks } from './inline-links';

/** Renders text with `[label](url)` links, e.g. `Built with [Angular](https://angular.dev)`. */
@Component({
  selector: 'app-inline-text',
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.href) {
        <a [href]="segment.href">{{ segment.text }}</a>
      } @else {
        {{ segment.text }}
      }
    }
  `,
})
export class InlineText {
  readonly text = input.required<string>();
  protected readonly segments = computed(() => parseInlineLinks(this.text()));
}
