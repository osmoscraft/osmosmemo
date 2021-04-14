chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['accessToken', 'tags', 'username', 'repo', 'filename'], async (/** @type {Options} */ options) => {
    if (!options.accessToken) {
      chrome.storage.sync.set({ accessToken: '' }, () => {});
    }
    if (!options.tags) {
      chrome.storage.sync.set({ tags: [] }, () => {});
    }
    if (!options.username) {
      chrome.storage.sync.set({ username: '' }, () => {});
    }
    if (!options.repo) {
      chrome.storage.sync.set({ repo: '' }, () => {});
    }
    if (!options.filename) {
      chrome.storage.sync.set({ filename: 'README.md' }, () => {});
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
