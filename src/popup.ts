import { Controller } from "./popup/controller";
import { Model, type CacheableModel } from "./popup/model";
import { View } from "./popup/view";

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

async function initialize() {
  /* Step 1 - Setup listener for the message from content script */
  await chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.command === "metadata-ready") {
      controller.onData(request.data as CacheableModel);
    }
    if (request.command === "cached-model-ready") {
      const cachedModel = request.data as CacheableModel;
      controller.onCache(cachedModel);
    }
  });

  /* Step 2 - Inject content script into active tab */
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTabId = tabs?.[0]?.id;
  if (!currentTabId) {
    console.error(`[popup] cannot get model. Activie tab does not exist.`);
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: currentTabId },
    files: ["content-script.js"],
  });

  /* Step 3 - Send out request to content script */
  chrome.tabs.sendMessage(currentTabId, { command: "get-model" });
}

initialize();

// debug
// window.model = model;
// window.view = view;
// window.controller = controller;
