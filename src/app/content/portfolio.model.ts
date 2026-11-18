/**
 * Content model for `portfolio.json`.
 * Optional (`?`) fields can be deleted from the JSON; the matching element,
 * or the whole section when its block is removed, is then not rendered.
 */

export interface Link {
  label: string;
  href: string;
}

export interface PreviewImage {
  /** Absolute URL, e.g. a raw.githubusercontent.com link into the project's repo. */
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface Project {
  /** URL-safe anchor; `/#<id>` scrolls to and highlights this card. */
  id?: string;
  kicker?: string;
  title: string;
  summary?: string;
  stack?: string[];
  links?: Link[];
  /** Screenshots shown in the preview dialog; the Preview button is hidden when empty. */
  images?: PreviewImage[];
}

export interface EducationEntry {
  school: string;
  location?: string;
  /** One line each; `label` renders bold before the text (e.g. "Relevant Coursework"). */
  items?: { label?: string; text: string }[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Portfolio {
  /** `title` is the browser tab title (falls back to `name`); `url` is the live site, shown on the résumé. */
  site: { name: string; title?: string; url?: string };
  nav?: Link[];
  /** Each label is optional; a missing label hides that résumé link. */
  resume?: { href: string; heroLabel?: string; contactLabel?: string };
  hero: {
    eyebrow?: string;
    headline: string;
    summary?: string;
    primaryCta?: Link;
    /** Remove to drop the portrait column entirely. */
    portrait?: {
      /** Filename inside `public/images/`; leave empty to show an empty frame. */
      file: string;
      alt: string;
    };
  };
  about?: {
    kicker?: string;
    heading?: string;
    education?: EducationEntry[];
    skillsHeading?: string;
    skillGroups?: SkillGroup[];
  };
  projects?: { heading?: string; period?: string; projects: Project[] };
  contact?: { headline?: string; links?: Link[] };
  /** Plain text; use `[label](https://url)` for inline links. */
  footer?: { left?: string; right?: string };
}
