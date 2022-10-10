import { getEntryPatternByHref } from "./markdown";

export function mergeContent(newEntryHref: string, newEntry: string, existinContent: string): string {
  const replaceResult = existinContent.replace(getEntryPatternByHref(newEntryHref), newEntry);
  return replaceResult === existinContent ? `${newEntry}\n${existinContent}` : replaceResult;
}
