/// <reference path="../shared/typings/index.d.ts" />

const saveButtonElement = document.querySelector('.js-save');
const updateTagsButtonsElement = document.querySelector('.js-update-tags');
const accessTokenElement = document.querySelector('.js-access-token');
const tagsElement = document.querySelector('.js-tags');
const resizeElements = document.querySelectorAll('.js-autosize');

function renderInputField({ element, string }) {
  element.value = string;
}

function renderAllFields() {
  chrome.storage.sync.get(['accessToken', 'tags'], (/** @type {Options} */ data) => {
    renderInputField({ element: accessTokenElement, string: data.accessToken });
    renderInputField({ element: tagsElement, string: JSON.stringify(data.tags) });
    autosize.update(resizeElements);
  });
}

autosize(resizeElements);
renderAllFields();

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync') {
    renderAllFields();
  }
});

saveButtonElement.addEventListener('click', () => {
  const accessToken = accessTokenElement.value;
  chrome.storage.sync.set({ accessToken }, () => {});
});

updateTagsButtonsElement.addEventListener('click', () => {
  chrome.storage.sync.get(['accessToken'], (/** @type {Options} */ data) => {
    fetch('https://api.github.com/repos/chuanqisun/wiki/contents/README.md')
      .then(res => res.json())
      .then(res => {
        const markdownString = b64DecodeUnicode(res.content);

        const tagsMatch = markdownString.match(/Genre[\r\n]+([^\r\n]+)/)[1];
        const tags = tagsMatch
          .split(' ')
          .filter(tag => tag.length)
          .map(tag => tag.split('#')[1]);

        chrome.storage.sync.set({ tags });
      });
  });
});

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}
