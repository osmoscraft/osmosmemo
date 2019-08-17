import { Model } from './model.js';
import { View } from './view.js';
import { Controller } from './controller.js';

/* Step 1 - Setup listener for the message from content script */
chrome.runtime.onMessage.addListener((request, sender) => {
  const model = new Model();
  const view = new View();
  const controller = new Controller(model, view);

  if (request.command == 'metadata-ready') {
    const { title, headings, href, hostname } = request.data;
    controller.onData({ title, headings, href, hostname });
  }
});

/* Step 2 - Inject script */
chrome.tabs.executeScript({
  file: 'content-script.js',
});
