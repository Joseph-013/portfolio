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
  kicker: string;
  title: string;
  summary: string;
  stack: string[];
  links: Link[];
  /** Screenshots shown in the preview dialog; the Preview button is hidden when empty. */
  images?: PreviewImage[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Portfolio {
  site: { name: string; title: string };
  nav: Link[];
  resume: { href: string; heroLabel: string; contactLabel: string };
  hero: {
    eyebrow: string;
    headline: string;
    summary: string;
    primaryCta: Link;
    portrait: {
      /** Filename inside `public/images/`; leave empty to show an empty frame. */
      file: string;
      alt: string;
    };
  };
  about: {
    kicker: string;
    heading: string;
    /** Plain text; use `[label](https://url)` for inline links. */
    paragraphs: string[];
    /** Optional buttons shown under the paragraphs. */
    links?: Link[];
    skillsHeading: string;
    skillGroups: SkillGroup[];
  };
  work: { heading: string; period: string; projects: Project[] };
  contact: { headline: string; links: Link[] };
  footer: { left: string; right: string };
}
