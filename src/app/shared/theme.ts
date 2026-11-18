import { DOCUMENT } from '@angular/common';
import { effect, inject, Service, signal } from '@angular/core';

export type ThemeName = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Service()
export class Theme {
  private readonly document = inject(DOCUMENT);

  readonly current = signal<ThemeName>(this.initial());

  constructor() {
    effect(() => {
      const theme = this.current();
      this.document.documentElement.classList.toggle('dark', theme === 'dark');
      this.document.getElementById('favicon')?.setAttribute('href', `favicon-${theme}.svg`);
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // storage unavailable (private mode); the choice just won't persist
      }
    });
  }

  toggle(): void {
    this.current.update((theme) => (theme === 'dark' ? 'light' : 'dark'));
  }

  private initial(): ThemeName {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // fall through to the system preference
    }
    const prefersDark = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
