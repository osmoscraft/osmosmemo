/* Step 1 - Setup listener for the message from content script */
chrome.runtime.onMessage.addListener((request, sender) => {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  if (request.command == 'metadata-ready') {
    document.querySelector('#output').innerText = JSON.stringify(request.data);
  }
});

/* Step 2 - Inject script */
chrome.tabs.executeScript({
  file: 'content-script.js',
});
