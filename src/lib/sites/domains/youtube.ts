import type { SiteConfig, StringExtractor } from "../sites";
import { defaultSiteConfig, docTitle, locationHref } from "./default";

const youtubeH1TitleExtractor: StringExtractor = (document) =>
  document.querySelector<HTMLHeadingElement>("h1:not([hidden])")?.innerText?.trim();

// YouTube does not refresh most of the fields in the document html when user navigates to a different video
export const youtubeSiteConfig: SiteConfig = {
  siteMatcher: (document) => document.location.hostname.includes("youtube.com"),
  urlExtractors: [locationHref],
  cacheKeyExtractors: defaultSiteConfig.cacheKeyExtractors,
  titleExtractors: [youtubeH1TitleExtractor, docTitle],
};
