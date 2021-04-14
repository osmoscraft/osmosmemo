import { browser } from 'webextension-polyfill-ts';

try {
  const cachedModelString = sessionStorage.getItem('cached-model');
  if (!cachedModelString) throw new Error();
  const cachedModel = JSON.parse(sessionStorage.getItem('cached-model'));
  browser.runtime.sendMessage({ command: 'metadata-cache-ready', data: cachedModel });
} catch (e) {
  browser.runtime.sendMessage({ command: 'metadata-ready', data: getMetadata() });
}

function getMetadata() {
  const href = location.href;
  const headElement = document.querySelector('head');
  const titleElement = headElement && headElement.querySelector('title');
  const title = (titleElement && titleElement.innerText) || '';
  const headings = [...document.querySelectorAll('h1')].map((heading) => heading.innerText);

  return {
    title,
    headings,
    href,
  };
}

browser.runtime.onMessage.addListener((request) => {
  if (request.command === 'cache-model') {
    sessionStorage.setItem('cached-model', JSON.stringify(request.data));
  }
});
