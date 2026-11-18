import { IMAGE_CONFIG, NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import type { Project } from '../content/portfolio.model';

/** "Preview" link that opens a dialog with a screenshot carousel for one project. */
@Component({
  selector: 'app-project-preview',
  imports: [HlmCarouselImports, HlmDialogImports, NgOptimizedImage],
  // Thumbnails reuse the full-size slide URL (no image CDN to resize remote repo images),
  // so the browser fetches each file once; silence the oversized-image dev warning here only.
  providers: [{ provide: IMAGE_CONFIG, useValue: { disableImageSizeWarning: true } }],
  template: `
    <hlm-dialog>
      <button hlmDialogTrigger class="text-primary cursor-pointer underline underline-offset-3">
        Preview<span class="sr-only"> {{ project().title }}</span>
      </button>
      <hlm-dialog-content
        *hlmDialogPortal="let ctx"
        class="max-h-[92dvh] overflow-y-auto sm:max-w-5xl"
      >
        <hlm-dialog-header>
          <h2 hlmDialogTitle>{{ project().title }}</h2>
          @if (project().summary) {
            <p hlmDialogDescription>{{ project().summary }}</p>
          }
        </hlm-dialog-header>

        <hlm-carousel #carousel="hlmCarousel" [attr.aria-label]="project().title + ' screenshots'">
          <hlm-carousel-content>
            @for (image of images(); track image.src) {
              <hlm-carousel-item>
                <div
                  class="bg-muted flex h-[min(60dvh,620px)] items-center justify-center overflow-hidden rounded-md"
                >
                  <img
                    [ngSrc]="image.src"
                    [width]="image.width"
                    [height]="image.height"
                    [alt]="image.alt"
                    class="h-auto max-h-full w-auto max-w-full"
                  />
                </div>
              </hlm-carousel-item>
            }
          </hlm-carousel-content>
          <button hlm-carousel-previous class="start-2"></button>
          <button hlm-carousel-next class="end-2"></button>

          <div class="mt-3 flex items-center justify-between gap-3 text-xs">
            <span class="text-muted-foreground" aria-hidden="true">
              {{ images()[carousel.currentSlide()]?.alt }}
            </span>
            <hlm-carousel-slide-display
              [label]="'Screenshot'"
              slideClass="text-muted-foreground text-xs"
            />
          </div>

          <ul class="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Jump to screenshot">
            @for (thumb of images(); track thumb.src) {
              <li class="shrink-0">
                <button
                  type="button"
                  class="bg-muted block h-14 cursor-pointer overflow-hidden rounded border-2 opacity-60 transition hover:opacity-100 aria-[current=true]:opacity-100"
                  [class.border-primary]="$index === carousel.currentSlide()"
                  [class.border-transparent]="$index !== carousel.currentSlide()"
                  [attr.aria-current]="$index === carousel.currentSlide() ? 'true' : null"
                  [attr.aria-label]="'Screenshot ' + ($index + 1) + ': ' + thumb.alt"
                  (click)="carousel.scrollTo($index)"
                >
                  <img
                    [ngSrc]="thumb.src"
                    [width]="thumb.width"
                    [height]="thumb.height"
                    alt=""
                    class="h-full w-auto"
                  />
                </button>
              </li>
            }
          </ul>
        </hlm-carousel>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class ProjectPreview {
  readonly project = input.required<Project>();

  protected readonly images = computed(() => this.project().images ?? []);
}
