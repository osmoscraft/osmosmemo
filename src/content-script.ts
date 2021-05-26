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

  console.log(`[osmos] content-script activated`);

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
        browser.runtime.sendMessage({ command: "metadata-ready", data: model });
        console.log(`[osmos] get metadata`, model);
      }
    }
  });

  function getMetadata() {
    const href = getPageUrl();
    const title = getPageTitle();

    return {
      title,
      href,
    };
  }

  function getPageUrl() {
    let url = document.querySelector(`link[rel="canonical"]`)?.getAttribute("href")?.trim();

    if (!url) {
      url = location.href;
    }

    return url;
  }

  function getPageTitle() {
    let title = document.querySelector(`meta[property="og:title"]`)?.getAttribute("content")?.trim();

    if (!title) {
      title = document.querySelector(`meta[name="twitter:title"]`)?.getAttribute("content")?.trim();
    }

    if (!title) {
      title = document.querySelector("title")?.innerText?.trim();
    }

    if (!title) {
      title = document.querySelector("h1")?.innerText?.trim();
    }

    if (!title) {
      title = "";
    }

    return title;
  }
}

injectContentScript();
