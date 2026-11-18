import { Directive } from '@angular/core';
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { classes } from '@spartan-ng/helm/utils';

export const hlmSeparatorClass =
  'inline-flex shrink-0 bg-border data-horizontal:h-0.5 data-horizontal:w-full data-vertical:w-0.5 data-vertical:self-stretch';

@Directive({
  selector: '[hlmSeparator],hlm-separator',
  exportAs: 'hlmSeparator',
  hostDirectives: [{ directive: BrnSeparator, inputs: ['orientation', 'decorative'] }],
  host: {
    'data-slot': 'separator',
  },
})
export class HlmSeparator {
  constructor() {
    classes(() => hlmSeparatorClass);
  }
}
