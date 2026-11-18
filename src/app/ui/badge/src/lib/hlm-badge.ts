import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const badgeVariants = cva(
  'gap-1 rounded-md border border-transparent px-2.5 py-[3px] text-[11px] tracking-[0.02em] font-normal transition-all has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&>ng-icon]:text-[length:--spacing(3)] group/badge focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:ring-[3px] [&>ng-icon]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-brand-100 text-brand-800',
        accent2: 'bg-brand-2-100 text-brand-2-800',
        secondary: 'bg-ink-300 text-ink-800 dark:bg-ink-800 dark:text-ink-100',
        destructive:
          'bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20',
        outline: 'border-brand-700 text-brand-700 dark:border-brand-400 dark:text-brand-400 [a]:hover:bg-brand/10',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

@Directive({
  selector: '[hlmBadge],hlm-badge',
  exportAs: 'hlmBadge',
  host: {
    'data-slot': 'badge',
    '[attr.data-variant]': 'variant()',
  },
})
export class HlmBadge {
  public readonly variant = input<BadgeVariants['variant']>('default');

  constructor() {
    classes(() => badgeVariants({ variant: this.variant() }));
  }
}
