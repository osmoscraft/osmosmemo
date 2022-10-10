import browser from "webextension-polyfill";
import { fitTextareaToContent } from "../lib/utils/fit-textarea-to-content";
import type { FullModel } from "./model";

const $ = document.querySelector.bind(document);

/* Input elements */
const formElement = $(".js-creation-form") as HTMLFormElement;
const titleInputElement = $(".js-title") as HTMLInputElement;
const linkInputElement = $(".js-link") as HTMLInputElement;
const existingLinkMarker = $(".js-existing-link-marker") as HTMLSpanElement;
const descriptionInputElement = $(".js-description") as HTMLInputElement;
const previewElement = $(".js-preview") as HTMLInputElement;
const addedTagsElement = $(".added-tags") as HTMLElement;
const tagInputElement = $(".js-tag-input") as HTMLInputElement;
const tagOptionsElement = $(".js-tag-options") as HTMLDataListElement;
const addTagButtonElement = $(".js-add-tag-button") as HTMLButtonElement;
const actionsElement = $(".js-actions") as HTMLDivElement;
const saveButtonElement = $(".js-save") as HTMLButtonElement;
const openOptionsButtonElement = $(".js-open-options") as HTMLButtonElement;
const openLibraryLinkElement = $(".js-open-library") as HTMLAnchorElement;

const saveStatusDisplayStrings = new Map([
  ["new", "💾 Save"],
  ["saving", "💾 Saving…"],
  ["saved", "✅ Saved"],
  ["error", "❌ Error"],
]);

export class View {
  constructor() {
    // fix me: chromium edge seems to be flaky with autosize
    fitTextareaToContent();
  }

  validateForm() {
    return formElement.checkValidity();
  }

  handleOutput({ onTitleChange, onLinkChange, onDescriptionChange, onAddTag, onRemoveTagByIndex, onSave }) {
    formElement.addEventListener("submit", (event) => {
      event.preventDefault(); // don't reload page

      // commit any tag left in the input
      this.commitTag({ onAddTag });

      onSave();
    });

    titleInputElement.addEventListener("input", (e) => onTitleChange((e.target as HTMLInputElement).value));
    linkInputElement.addEventListener("input", (e) => onLinkChange((e.target as HTMLInputElement).value));
    descriptionInputElement.addEventListener("input", (e) => onDescriptionChange((e.target as HTMLInputElement).value));
    addTagButtonElement.addEventListener("click", () => this.commitTag({ onAddTag, refocus: true }));
    tagInputElement.addEventListener("keydown", (e) => {
      if (e.isComposing) {
        // passthrough IME events
        return;
      }

      if (e.key === "Enter") {
        // prevent form submission
        e.preventDefault();
      }

      if (tagInputElement.value !== "" && e.key === "Enter") {
        this.commitTag({ onAddTag });
      }
      if (tagInputElement.value === "" && e.key === "Backspace") {
        this.tryFocusLastTag();
      }
    });

    addedTagsElement.addEventListener("click", (e) => {
      const selectedButton = (e.target as HTMLElement).closest("button");
      if (!selectedButton) return;
      const removeIndex = parseInt(((e.target as HTMLElement).closest("button")!.dataset as any).index);
      this.removeTagAtIndex(removeIndex, onRemoveTagByIndex);
    });
    addedTagsElement.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        const removeIndex = parseInt(((e.target as HTMLElement).closest("button")!.dataset as any).index);
        this.removeTagAtIndex(removeIndex, onRemoveTagByIndex);
      }
    });
    previewElement.addEventListener("focus", () => previewElement.select());
    previewElement.addEventListener("click", () => previewElement.select());

    openOptionsButtonElement.addEventListener("click", () => browser.runtime.openOptionsPage());
  }

  render({ state, previousState }: { state: FullModel; previousState: FullModel }) {
    const { title, href, description, isSaved, tags, tagOptions, saveStatus, connectionStatus, libraryUrl } = state;

    existingLinkMarker.hidden = !isSaved;

    if (title !== previousState.title) {
      titleInputElement.value = title!;
    }

    if (href !== previousState.href) {
      linkInputElement.value = href!;
    }

    if (description !== previousState.description) {
      descriptionInputElement.value = description;
    }

    if (tags.join("") !== previousState.tags.join("")) {
      addedTagsElement.innerHTML = tags
        .map((tag, index) => `<button class="added-tag" type="button" data-index="${index}">#${tag}</button>`)
        .join("");
    }

    if (tagOptions.join("") !== previousState.tagOptions.join("")) {
      tagOptionsElement.innerHTML = tagOptions.map((option) => `<option value="${option}">`).join("");
    }

    const newOutputPreview = this.getPreviewOutput(title, href, description, tags);
    if (previewElement.innerText !== newOutputPreview) {
      previewElement.innerText = newOutputPreview;
    }

    if (saveStatus !== previousState.saveStatus) {
      saveButtonElement.innerText = saveStatusDisplayStrings.get(saveStatus)!;
    }

    if (libraryUrl !== previousState.libraryUrl) {
      if (libraryUrl && libraryUrl.length) {
        openLibraryLinkElement.href = libraryUrl;
      } else {
        openLibraryLinkElement.removeAttribute("href");
      }
    }

    if (connectionStatus !== previousState.connectionStatus) {
      const isError = connectionStatus === "error";
      if (isError) {
        openLibraryLinkElement.hidden = true;
        saveButtonElement.hidden = true;
      }
      actionsElement.classList.toggle("has-error", isError);
      openOptionsButtonElement.classList.toggle("has-error", isError);
    }

    fitTextareaToContent();
  }

  removeTagAtIndex(index, onRemoveTagByIndex) {
    onRemoveTagByIndex(index);
    const remainingTags = addedTagsElement.querySelectorAll("button");
    const elementToFocus = remainingTags.length ? remainingTags[Math.max(0, index - 1)] : tagInputElement;
    elementToFocus.focus();
  }

  tryFocusLastTag() {
    const remainingTags = addedTagsElement.querySelectorAll("button");
    if (remainingTags.length) {
      remainingTags[remainingTags.length - 1].focus();
    }
  }

  getPreviewOutput(title, href, description, tags) {
    const titleLink = `- [${title}](${href})`;
    const tagList = tags.map((tag) => `#${tag}`).join("");
    const outputArray = [titleLink];

    if (description) {
      outputArray.push(description);
    }

    if (tagList.length) {
      outputArray.push(tagList);
    }

    return outputArray.join(" ");
  }

  commitTag(input: { onAddTag: (value: string) => any; refocus?: boolean }) {
    const { onAddTag, refocus } = input;
    const sanitizedValue = this.getSanitizedTagInput();
    if (sanitizedValue !== "") {
      onAddTag(sanitizedValue);
    }

    tagInputElement.value = "";

    if (refocus) {
      tagInputElement.focus();
    }
  }

  getSanitizedTagInput() {
    return tagInputElement.value
      .toLocaleLowerCase()
      .trim()
      .replace(/[\s-_]+/g, "-") /* Standardize joiner to - */
      .replace(/#/g, ""); /* Prevent duplicated tag symbol */
  }
}
