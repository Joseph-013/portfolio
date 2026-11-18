export interface TextSegment {
  text: string;
  href?: string;
}

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Splits text containing `[label](url)` into plain and link segments (no innerHTML needed). */
export function parseInlineLinks(input: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of input.matchAll(LINK)) {
    if (match.index > last) segments.push({ text: input.slice(last, match.index) });
    segments.push({ text: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < input.length) segments.push({ text: input.slice(last) });
  return segments;
}
