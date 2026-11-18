import { Directive } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmCardDescription]',
  exportAs: 'hlmCardDescription',
  host: { 'data-slot': 'card-description' },
})
export class HlmCardDescription {
  constructor() {
    classes(() => 'text-foreground/80 text-[13px]');
  }
}
