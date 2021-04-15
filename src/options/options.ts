import { browser } from 'webextension-polyfill-ts';
import type { Options } from '../background';

import { getContentString } from '../shared/github/rest-api';
import { fitTextareaToContent } from '../shared/utils/fit-textarea-to-content';
import { getUniqueTagsFromMarkdownString } from '../shared/utils/tags';

const optionsForm = document.querySelector('.js-options-form') as HTMLElement;
const connectButtonElement = document.querySelector('.js-connect') as HTMLElement;
const accessTokenElement = document.querySelector('.js-access-token') as HTMLInputElement;
const tagsElement = document.querySelector('.js-tags') as HTMLElement;
const tagCountElement = document.querySelector('.js-tag-count') as HTMLElement;
const usernameElement = document.querySelector('.js-username') as HTMLInputElement;
const repoElement = document.querySelector('.js-repo') as HTMLInputElement;
const filenameElement = document.querySelector('.js-filename') as HTMLInputElement;
const resizeElements = document.querySelectorAll('.js-autosize');

function renderInputField({ element, string }) {
  element.value = string;
}

async function renderAllFields() {
  const data: Options = await browser.storage.sync.get(['accessToken', 'tags', 'username', 'repo', 'filename']);
  const { accessToken, username, repo, filename, tags } = data;

  renderInputField({ element: accessTokenElement, string: accessToken });
  renderInputField({ element: usernameElement, string: username });
  renderInputField({ element: repoElement, string: repo });
  renderInputField({ element: filenameElement, string: filename });
  renderInputField({ element: tagsElement, string: tags.join(', ') });
  tagCountElement.innerText = `${tags.length} ${tags.length === 1 ? 'tag' : 'tags'} found`;

  fitTextareaToContent();
}

renderAllFields();

browser.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'sync') {
    renderAllFields();
  }
});

connectButtonElement.addEventListener('click', async (event) => {
  if (!(optionsForm as HTMLFormElement).checkValidity()) return;
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
    browser.storage.sync.set({ accessToken, username, repo, filename, tags: uniqueTags });
  } catch (e) {
    connectButtonElement.innerText = '❌ Something went wrong. Please try again.';
  }
});
