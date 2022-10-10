import { escapeRegExp } from "./regexp";

export function mergeContent(newEntryHref: string, newEntry: string, existinContent: string): string {
  const existingItemPattern = String.raw`^- \[.+\]\(${escapeRegExp(newEntryHref)}\).*$`;
  const replaceResult = existinContent.replace(new RegExp(existingItemPattern, "m"), newEntry);
  return replaceResult === existinContent ? `${newEntry}\n${existinContent}` : replaceResult;
}
