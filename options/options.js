const saveButtonElement = document.querySelector('.js-save');
const tagOptionsElement = document.querySelector('.js-tag-options');
const resizeElements = document.querySelectorAll('.js-autosize');
const previewElement = document.querySelector('.js-preview');

chrome.storage.sync.get('tagOptions', function(data) {
  tagOptionsElement.value = JSON.stringify(data.tagOptions);
  previewElement.value = JSON.stringify(data);
  autosize.update(resizeElements);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync') {
    chrome.storage.sync.get('tagOptions', function(data) {
      previewElement.value = JSON.stringify(data);
      autosize.update(resizeElements);
    });
  }
});

saveButtonElement.addEventListener('click', () => {
  try {
    const tagOptions = JSON.parse(tagOptionsElement.value);
    chrome.storage.sync.set({ tagOptions }, () => {});
  } catch (e) {
    alert('Invalid JSON format');
  }
});

autosize(resizeElements);
