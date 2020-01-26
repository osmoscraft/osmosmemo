/// <reference path="../shared/typings/index.d.ts" />

import { testConnection, getContentString } from '../shared/github/rest-api.js';

const optionsForm = document.querySelector('.js-options-form');
const connectButtonElement = document.querySelector('.js-connect');
const accessTokenElement = document.querySelector('.js-access-token');
const tagsElement = document.querySelector('.js-tags');
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
    renderInputField({ element: tagsElement, string: JSON.stringify(tags) });
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

  const isConnectionValid = await testConnection({
    accessToken,
    username,
    repo,
    filename,
  });

  if (isConnectionValid) {
    chrome.storage.sync.set({ accessToken, username, repo, filename }, () => {});
    getTagsFromRemote();
    connectButtonElement.innerText = '🙌 Connected to GitHub';
  } else {
    connectButtonElement.innerText = '❌ Something went wrong. Please try again.';
  }
});

function getTagsFromRemote() {
  chrome.storage.sync.get(['accessToken', 'username', 'repo', 'filename'], async (/** @type {Options} */ data) => {
    const { accessToken, username, repo, filename } = data;

    const markdownString = await getContentString({ accessToken, username, repo, filename });

    // negative look ahead to make rule out any hashtags inside parenthesis
    const hashTags = markdownString.match(/(?!.*(?:\)|]))#([a-z0-9]+)/g);
    const textTags = hashTags.map(tag => tag.split('#')[1]);
    const uniqueTags = [...new Set(textTags)].sort();

    chrome.storage.sync.set({ tags: uniqueTags });
  });
}
