import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { imagePath, portfolio } from '../content/portfolio';
import { Reveal } from '../shared/reveal';
import { parseInlineLinks } from '../shared/inline-links';
import { Theme } from '../shared/theme';

@Component({
  selector: 'app-home',
  imports: [HlmBadge, HlmButton, HlmCard, NgOptimizedImage, Reveal],
  templateUrl: './home.html',
})
export class Home {
  protected readonly theme = inject(Theme);
  protected readonly content = portfolio;
  protected readonly aboutParagraphs = portfolio.about.paragraphs.map(parseInlineLinks);
  protected readonly portraitSrc = portfolio.hero.portrait.file
    ? imagePath(portfolio.hero.portrait.file)
    : null;

  constructor() {
    inject(Title).setTitle(portfolio.site.title);
  }
}
