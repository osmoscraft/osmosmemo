/// <reference path="../shared/typings/index.d.ts" />

import { b64DecodeUnicode } from '../shared/utils/base64.js';

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
    // TODO get repo, user, and filename from options
    fetch('https://api.github.com/repos/chuanqisun/wiki/contents/README.md')
      .then(res => res.json())
      .then(res => {
        const markdownString = b64DecodeUnicode(res.content);

        // negative look ahead to make rule out any hashtags inside parenthesis
        const hashTags = markdownString.match(/(?!.*(?:\)|]))#([a-z0-9]+)/g);
        const textTags = hashTags.map(tag => tag.split('#')[1]);
        const uniqueTags = [...new Set(textTags)].sort();

        chrome.storage.sync.set({ tags: uniqueTags });
      });
  });
});
