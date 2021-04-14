/// <reference path="./typings/options.d.ts" />
import { browser } from 'webextension-polyfill-ts';

browser.runtime.onInstalled.addListener(async () => {
  const options = (await browser.storage.sync.get(['accessToken', 'tags', 'username', 'repo', 'filename'])) as Options;

  // TODO use parallelism
  if (!options.accessToken) {
    await browser.storage.sync.set({ accessToken: '' });
  }
  if (!options.tags) {
    await browser.storage.sync.set({ tags: [] });
  }
  if (!options.username) {
    await browser.storage.sync.set({ username: '' });
  }
  if (!options.repo) {
    await browser.storage.sync.set({ repo: '' });
  }
  if (!options.filename) {
    await browser.storage.sync.set({ filename: 'README.md' });
  }
});
