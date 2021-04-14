/// <reference path="../typings/options.d.ts" />
import autosize from "autosize";

import { getContentString } from '../shared/github/rest-api.js';
import { getUniqueTagsFromMarkdownString } from '../shared/utils/tags.js';

const optionsForm = document.querySelector('.js-options-form');
const connectButtonElement = document.querySelector('.js-connect');
const accessTokenElement = document.querySelector('.js-access-token');
const tagsElement = document.querySelector('.js-tags');
const tagCountElement = document.querySelector('.js-tag-count');
const usernameElement = document.querySelector('.js-username');
const repoElement = document.querySelector('.js-repo');
const filenameElement = document.querySelector('.js-filename');
const resizeElements = document.querySelectorAll('.js-autosize');

function renderInputField({ element, string }) {
  element.value = string;
}


function renderAllFields() {
  chrome.storage.sync.get(['accessToken', 'tags', 'username', 'repo', 'filename'], (/** @type {Options} */ data) => {
    const { accessToken, username, repo, filename, tags } = data;

    renderInputField({ element: accessTokenElement, string: accessToken });
    renderInputField({ element: usernameElement, string: username });
    renderInputField({ element: repoElement, string: repo });
    renderInputField({ element: filenameElement, string: filename });
    renderInputField({ element: tagsElement, string: tags.join(', ') });
    tagCountElement.innerText = `${tags.length} ${tags.length === 1 ? 'tag' : 'tags'} found`;
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

connectButtonElement.addEventListener('click', async event => {
  if (!optionsForm.checkValidity()) return;
  event.preventDefault();

  const accessToken = accessTokenElement.value;
  const username = usernameElement.value;
  const repo = repoElement.value;
  const filename = filenameElement.value;

  connectButtonElement.innerText = '🔗 Connecting…';

  try {
    const markdownString = await getContentString({ accessToken, username, repo, filename });
    const uniqueTags = await getUniqueTagsFromMarkdownString(markdownString);
    connectButtonElement.innerText = '🙌 Connected to GitHub';
    chrome.storage.sync.set({ accessToken, username, repo, filename, tags: uniqueTags });
  } catch (e) {
    connectButtonElement.innerText = '❌ Something went wrong. Please try again.';
  }
});
