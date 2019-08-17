import { Model } from './model.js';
import { View } from './view.js';
import { Controller } from './controller.js';

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

/* Step 1 - Setup listener for the message from content script */
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.command === 'metadata-ready') {
    const { title, headings, href, hostname } = request.data;
    debugger;
    controller.onData({ title, headings, href, hostname });
  }

  if (request.command === 'metadata-cache-ready') {
    const cachedModel = request.data;
    controller.onCache(cachedModel);
  }
});

/* Step 2 - Inject script */
chrome.tabs.executeScript({
  file: 'content-script.js',
});

// debug
// window.model = model;
// window.view = view;
// window.controller = controller;
