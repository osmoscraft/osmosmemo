import { Model } from './model.js';
import { View } from './view.js';
import { Controller } from './controller.js';
import { browser } from 'webextension-polyfill-ts';

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

/* Step 1 - Setup listener for the message from content script */
browser.runtime.onMessage.addListener((request, sender) => {
  if (request.command === 'metadata-ready') {
    const { title, headings, href } = request.data;
    controller.onData({ title, headings, href });
  }

  if (request.command === 'metadata-cache-ready') {
    const cachedModel = request.data;
    controller.onCache(cachedModel);
  }
});

/* Step 2 - Inject script */
browser.tabs.executeScript({
  file: 'content-script.js',
});

// debug
// window.model = model;
// window.view = view;
// window.controller = controller;
