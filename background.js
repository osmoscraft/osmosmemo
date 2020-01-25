/// <reference path="./shared/typings/index.d.ts" />

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['accessToken', 'tags'], async (/** @type {Options} */ options) => {
    if (!options.accessToken) {
      chrome.storage.sync.set({ accessToken: '' }, () => {});
    }
    if (!options.tags) {
      chrome.storage.sync.set({ tags: [] }, () => {});
    }
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              schemes: ['http', 'https'],
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
