import { browser } from "webextension-polyfill-ts";

declare global {
  interface Window {
    _osmosmemoInjected?: boolean;
  }
}

function injectContentScript() {
  // make sure the content script is injected only on first run
  if (window._osmosmemoInjected) return;
  window._osmosmemoInjected = true;

  browser.runtime.onMessage.addListener((request) => {
    if (request.command === "set-cached-model") {
      console.log(`[osmos] set cached model`, request.data);
      sessionStorage.setItem("cached-model", JSON.stringify(request.data));
    } else if (request.command === "get-model") {
      try {
        const cachedModelString = sessionStorage.getItem("cached-model");
        if (!cachedModelString) throw new Error();
        const cachedModel = JSON.parse(cachedModelString);
        console.log(`[osmos] get cached model`, cachedModel);
        browser.runtime.sendMessage({ command: "cached-model-ready", data: cachedModel });
      } catch (e) {
        const model = getMetadata();
        browser.runtime.sendMessage({ command: "model-ready", data: model });
        console.log(`[osmos] get model`, model);
      }
    }
  });

  function getMetadata() {
    const href = location.href;
    const headElement = document.querySelector("head");
    const titleElement = headElement && headElement.querySelector("title");
    const title = (titleElement && titleElement.innerText) || "";
    const headings = [...document.querySelectorAll("h1")].map((heading) => heading.innerText);

    return {
      title,
      headings,
      href,
    };
  }
}

injectContentScript();
