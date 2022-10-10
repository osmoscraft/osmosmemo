import { escapeRegExp } from "./regexp";

export function getEntryPatternByHref(href: string): RegExp {
  const existingItemPattern = String.raw`^- \[.+\]\(${escapeRegExp(href)}\).*$`;
  return new RegExp(existingItemPattern, "m");
}

export interface ParsedEntry {
  href: string;
  title: string;
  description: string;
  tags: string[];
}

/** Given a singple single markdown, parse its field */
export function parseEntry(markdown: string): ParsedEntry | null {
  const linkPattern = /^- \[(.+)\]\((.+)\)/;
  const linkMatch = markdown.match(linkPattern);
  if (!linkMatch) return null;

  const [full, title, href] = linkMatch;
  const remaining = markdown.slice(full.length);

  const tagsPattern = /#[^\s]+[\s]*$/;
  const tagsMatch = remaining.match(tagsPattern);
  const tags = tagsMatch ? tagsMatch[0].trim().split("#").filter(Boolean) : [];

  const description = remaining.slice(0, tagsMatch?.index).trim();

  return { title, href, tags, description };
}
