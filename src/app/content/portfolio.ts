import data from './portfolio.json';
import type { Portfolio } from './portfolio.model';

/** Site content, type-checked against the model so a bad edit to the JSON fails the build. */
export const portfolio: Portfolio = data;

/**
 * Imported JSON skips excess-property checks, so a renamed or misspelled top-level key
 * (e.g. `work` -> `projects`) would otherwise be silently ignored. This fails the build instead,
 * naming the unknown key.
 */
type NoUnknownKeys<T extends never> = T;
export type ContentKeysCheck = NoUnknownKeys<Exclude<keyof typeof data, keyof Portfolio>>;

/** Images live in `public/images/`; the JSON only stores the filename. */
export const imagePath = (file: string): string => `images/${file}`;
