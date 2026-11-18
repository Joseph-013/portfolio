import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { imagePath, portfolio } from '../content/portfolio';
import { Anchor } from '../shared/anchor';
import { Reveal } from '../shared/reveal';
import { ProjectPreview } from './project-preview';
import { InlineText } from '../shared/inline-text';
import { Theme } from '../shared/theme';

@Component({
  selector: 'app-home',
  imports: [HlmBadge, HlmButton, HlmCard, InlineText, NgOptimizedImage, ProjectPreview, Reveal],
  templateUrl: './home.html',
})
export class Home {
  protected readonly theme = inject(Theme);
  protected readonly content = portfolio;
  protected readonly portraitSrc = portfolio.hero.portrait?.file
    ? imagePath(portfolio.hero.portrait.file)
    : null;

  private readonly anchor = inject(Anchor);

  /** Section or project id navigated to; the matching project card is highlighted. */
  protected readonly targetId = this.anchor.target;

  constructor() {
    inject(Title).setTitle(portfolio.site.title ?? portfolio.site.name);

    // An id captured from the URL on load: its element only exists after the first render.
    afterNextRender(() => {
      const id = this.targetId();
      if (id) this.anchor.go(id, 'instant');
    });
  }
}
