import { browser } from "webextension-polyfill-ts";

import { getContentString } from "../shared/github/rest-api";
import { fitTextareaToContent } from "../shared/utils/fit-textarea-to-content";
import { getUniqueTagsFromMarkdownString } from "../shared/utils/tags";
import { getUserOptions, setUserOptions } from "../shared/utils/user-config";

const optionsForm = document.querySelector(".js-options-form") as HTMLElement;
const connectButtonElement = document.querySelector(".js-connect") as HTMLElement;
const accessTokenElement = document.querySelector(".js-access-token") as HTMLInputElement;
const tagsElement = document.querySelector(".js-tags") as HTMLElement;
const tagCountElement = document.querySelector(".js-tag-count") as HTMLElement;
const usernameElement = document.querySelector(".js-username") as HTMLInputElement;
const repoElement = document.querySelector(".js-repo") as HTMLInputElement;
const filenameElement = document.querySelector(".js-filename") as HTMLInputElement;

function renderInputField({ element, string }) {
  element.value = string;
}

async function renderAllFields() {
  const { accessToken, username, repo, filename } = await getUserOptions();

  renderInputField({ element: accessTokenElement, string: accessToken });
  renderInputField({ element: usernameElement, string: username });
  renderInputField({ element: repoElement, string: repo });
  renderInputField({ element: filenameElement, string: filename });
}

renderAllFields();

browser.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync") {
    renderAllFields();
  }
});

connectButtonElement.addEventListener("click", async (event) => {
  if (!(optionsForm as HTMLFormElement).checkValidity()) return;
  event.preventDefault();

  const accessToken = accessTokenElement.value;
  const username = usernameElement.value;
  const repo = repoElement.value;
  const filename = filenameElement.value;

  connectButtonElement.innerText = "🔗 Connection…";

  try {
    const markdownString = await getContentString({ accessToken, username, repo, filename });
    connectButtonElement.innerText = "✅ Connected to GitHub";
    setUserOptions({ accessToken, username, repo, filename });

    const tagOptions = await getUniqueTagsFromMarkdownString(markdownString);
    updateTagOptionsPreview(tagOptions);
    showConditionalElements("on-success");
  } catch (e) {
    connectButtonElement.innerText = "❌ Something went wrong. Try again";
    showConditionalElements("on-error");
  }
});

function updateTagOptionsPreview(tags: string[]) {
  renderInputField({ element: tagsElement, string: tags.join(", ") });
  tagCountElement.innerText = `${tags.length} ${tags.length === 1 ? "tag" : "tags"} found`;

  fitTextareaToContent();
}

function showConditionalElements(condition: "on-success" | "on-error") {
  (document.querySelectorAll(`[data-show]`) as NodeListOf<HTMLElement>).forEach((element) => {
    if (element.dataset.show === condition) {
      element.dataset.showActive = "";
    } else {
      delete element.dataset.showActive;
    }
  });
}
