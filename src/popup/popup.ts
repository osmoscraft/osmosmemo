import { Model } from "./model";
import { View } from "./view";
import { Controller } from "./controller";
import { browser } from "webextension-polyfill-ts";

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

async function initialize() {
  /* Step 1 - Setup listener for the message from content script */
  await browser.runtime.onMessage.addListener((request, sender) => {
    if (request.command === "model-ready") {
      const { title, headings, href } = request.data;

      controller.onData({ title, headings, href });
    }
    if (request.command === "cached-model-ready") {
      const cachedModel = request.data;
      controller.onCache(cachedModel);
    }
  });

  /* Step 2 - Inject content script into active tab */
  await browser.tabs.executeScript({
    file: "content-script.js",
  });

  /* Step 3 - Send out request to content script */
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tabs?.[0]?.id) {
    console.error(`[popup] cannot get model. Activie tab does not exist.`);
    return;
  }
  browser.tabs.sendMessage(tabs[0].id, { command: "get-model" });
}

initialize();

// debug
// window.model = model;
// window.view = view;
// window.controller = controller;
