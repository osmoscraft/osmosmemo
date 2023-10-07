import type { SiteConfig, StringExtractor } from "../sites";
import { defaultSiteConfig } from "./default";

export const githubTitleExtractor: StringExtractor = (document) => {
  return parseGithubRepoTitle(document.title)?.tagline;
};

export const githubSiteConfig: SiteConfig = {
  siteMatcher: matchGithubRepoRoot,
  urlExtractors: defaultSiteConfig.urlExtractors,
  cacheKeyExtractors: defaultSiteConfig.cacheKeyExtractors,
  titleExtractors: [githubTitleExtractor, ...defaultSiteConfig.titleExtractors],
};

function matchGithubRepoRoot(document: Document) {
  if (document.location.hostname !== "github.com") return false;

  const parsedPathname = parseGithubPathname(document.location.pathname);
  if (!parsedPathname) return false;

  const parsedTitle = parseGithubRepoTitle(document.title);
  if (!parsedTitle) return false;

  return parsedPathname.owner === parsedTitle.owner && parsedPathname.repo === parsedTitle.repo;
}

function parseGithubPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 2) return null;

  const [owner, repo] = segments;
  return {
    owner,
    repo,
  };
}

function parseGithubRepoTitle(title: string) {
  const matched = title.match(/([^\/]+)\/([^\/]+):\s(.+)/);
  if (!matched) return null;

  const [, owner, repo, tagline] = matched;

  return {
    owner,
    repo,
    tagline,
  };
}
