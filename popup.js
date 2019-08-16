function analyze() {
  console.log('popup: inject-script');

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'analyze-dom' }, function(response) {
      console.dir(response);
      document.querySelector('#output').innerText = response.result;
    });
  });
}

document.querySelector('#analyze').addEventListener('click', e => {
  analyze();
});
