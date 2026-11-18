import data from './portfolio.json';
import type { Portfolio } from './portfolio.model';

/** Site content, type-checked against the model so a bad edit to the JSON fails the build. */
export const portfolio: Portfolio = data;

/** Images live in `public/images/`; the JSON only stores the filename. */
export const imagePath = (file: string): string => `images/${file}`;
