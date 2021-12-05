import {
  canonicalUrl,
  locationHref,
  locationHrefCacheKey,
  ogTitle,
  twitterTitle,
  docTitle,
  h1Title,
  StringExtractor,
  youtubeH1TitleExtractor,
} from "./field-extractors";
import type { SiteMatcher } from "./site-matcher";

export interface SiteConfig {
  siteMatcher: SiteMatcher;
  titleExtractors: StringExtractor[];
  urlExtractors: StringExtractor[];
  cacheKeyExtractors: StringExtractor[];
}

const defaultSiteConfig: SiteConfig = {
  siteMatcher: () => true, // catch all
  urlExtractors: [canonicalUrl, locationHref],
  cacheKeyExtractors: [locationHrefCacheKey],
  titleExtractors: [ogTitle, twitterTitle, docTitle, h1Title],
};

// YouTube does not refresh most of the fields in the document html when user navigates to a different video
const youtubeSiteConfig: SiteConfig = {
  siteMatcher: (document) => document.location.hostname.includes("youtube.com"),
  urlExtractors: [locationHref],
  cacheKeyExtractors: defaultSiteConfig.cacheKeyExtractors,
  titleExtractors: [youtubeH1TitleExtractor, docTitle],
};

export const siteConfigs = [youtubeSiteConfig, defaultSiteConfig];
