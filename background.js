const defaultTagOptions = ['inspiration', 'opinion', 'reference', 'resource', 'tool', 'tutorial'];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('tagOptions', async options => {
    if (!options.tags) {
      chrome.storage.sync.set({ tagOptions: defaultTagOptions }, () => {});
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
