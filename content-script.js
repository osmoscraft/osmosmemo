console.log('Meta analyzer enabled');
chrome.runtime.sendMessage({ command: 'metadata-ready', data: getMetadata() });

function getMetadata() {
  const href = location.href;
  const hostname = location.hostname;

  const headElement = document.querySelector('head');
  const titleElement = headElement && headElement.querySelector('title');
  const title = titleElement && titleElement.innerText;
  const headings = [...document.querySelectorAll('h1')].map(heading => heading.innerText);

  return {
    title,
    headings,
    href,
    hostname,
  };
}
