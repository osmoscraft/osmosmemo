import { defaultSiteConfig } from "./domains/default";
import { githubSiteConfig } from "./domains/github";
import { youtubeSiteConfig } from "./domains/youtube";

export interface SiteConfig {
  siteMatcher: SiteMatcher;
  titleExtractors: StringExtractor[];
  urlExtractors: StringExtractor[];
  cacheKeyExtractors: StringExtractor[];
}
export type SiteMatcher = (document: Document) => boolean;

export type Extractor<T> = (document: Document) => T | undefined;

// Interfaces
export type StringExtractor = Extractor<string>;

export const siteConfigs = [youtubeSiteConfig, githubSiteConfig, defaultSiteConfig];
