import { browser } from "webextension-polyfill-ts";
import { siteConfigs } from "./lib/sites/sites";
import { lazyApply } from "./lib/utils/lazy-apply";
import type { CacheableModel } from "./popup/model";

declare global {
  interface Window {
    _osmosmemoInjected?: boolean;
  }
}

const SKIP_CANONICAL_HOSTNAMES = ["www.youtube.com"];

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
        if (!cachedModelString) throw new Error("No cache model found");
        const cachedModel: CacheableModel = JSON.parse(cachedModelString);

        if (cachedModel.cacheKey !== getPageCacheKey()) {
          throw new Error("Cache invalidated due to key change");
        }

        console.log(`[osmos] get cached model`, cachedModel);
        browser.runtime.sendMessage({ command: "cached-model-ready", data: cachedModel });
      } catch (e) {
        const model = getMetadata();
        browser.runtime.sendMessage({ command: "metadata-ready", data: model });
        console.log(`[osmos] get metadata`, model);
      }
    }
  });

  function getMetadata(): CacheableModel {
    const bestConfig = siteConfigs.find((config) => config.siteMatcher(document))!;

    return {
      title: lazyApply(bestConfig.titleExtractors, [document]),
      href: lazyApply(bestConfig.urlExtractors, [document]),
      cacheKey: lazyApply(bestConfig.cacheKeyExtractors, [document]),
    };
  }

  function getPageCacheKey() {
    const bestConfig = siteConfigs.find((config) => config.siteMatcher(document))!;

    return lazyApply(bestConfig.cacheKeyExtractors, [document])!;
  }
}

injectContentScript();
