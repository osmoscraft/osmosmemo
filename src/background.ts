import { browser } from 'webextension-polyfill-ts';

export interface Options {
  tags?: string[];
  accessToken?: string;
  username?: string;
  repo?: string;
  filename?: string;
}

browser.runtime.onInstalled.addListener(async () => {
  const options = (await browser.storage.sync.get(['accessToken', 'tags', 'username', 'repo', 'filename'])) as Options;

  let update: Options = {};
  if (!options.accessToken) {
    update.accessToken = '';
  }
  if (!options.tags) {
    update.tags = [];
  }
  if (!options.username) {
    update.username = '';
  }
  if (!options.repo) {
    update.repo = '';
  }
  if (!options.filename) {
    update.filename = 'README.md';
  }

  await browser.storage.sync.set(update);
});
