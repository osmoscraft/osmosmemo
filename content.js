chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command == 'analyze-dom') sendResponse({ result: document.querySelector('head').innerHTML });
});

console.log('content script injected');
