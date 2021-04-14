/// <reference path="../typings/options.d.ts" />

import { browser } from 'webextension-polyfill-ts';

/** Parse a markdown string for all words prefixed by hashtag(#). Ignore words that are inside parentheses and brackets */
export async function getUniqueTagsFromMarkdownString(markdownString) {
  const data: Options = await browser.storage.sync.get(['accessToken', 'username', 'repo', 'filename']);
  // negative look ahead to rule out any hashtags inside parenthesis
  const hashTags = markdownString.match(/(?!.*(?:\)|]))#([a-z0-9]+)/g) || [];
  const textTags = hashTags.map((tag) => tag.split('#')[1]);
  const uniqueTags = [...new Set(textTags)].sort();

  return uniqueTags;
}
