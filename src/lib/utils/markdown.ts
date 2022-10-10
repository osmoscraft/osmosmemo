import { escapeRegExp } from "./regexp";

export function getEntryPatternByHref(href: string): RegExp {
  const existingItemPattern = String.raw`^- \[.+\]\(${escapeRegExp(href)}\).*$`;
  return new RegExp(existingItemPattern, "m");
}
