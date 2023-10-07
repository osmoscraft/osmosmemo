import type { SiteConfig, StringExtractor } from "../sites";

// Title
export const ogTitle: StringExtractor = (document) =>
  document.querySelector(`meta[property="og:title"]`)?.getAttribute("content")?.trim();
export const twitterTitle: StringExtractor = (document) =>
  document.querySelector(`meta[name="twitter:title"]`)?.getAttribute("content")?.trim();
export const docTitle: StringExtractor = (document) => document.querySelector("title")?.innerText?.trim();
export const h1Title: StringExtractor = (document) => document.querySelector("h1")?.innerText?.trim();

// Href
export const canonicalUrl: StringExtractor = (document) =>
  document.querySelector(`link[rel="canonical"]`)?.getAttribute("href")?.trim();
export const locationHref: StringExtractor = (document) => document.location.href;

// Cache key
export const locationHrefCacheKey: StringExtractor = (document) => document.location.href;

// Site level
export const defaultSiteConfig: SiteConfig = {
  siteMatcher: () => true, // catch all
  urlExtractors: [canonicalUrl, locationHref],
  cacheKeyExtractors: [locationHrefCacheKey],
  titleExtractors: [ogTitle, twitterTitle, docTitle, h1Title],
};
