/* Input elements */
const titleInputElement = document.querySelector('.js-title');
const titleSwapElement = document.querySelector('.js-title-swap');
const dotsElement = document.querySelector('.js-dots');
const linkInputElement = document.querySelector('.js-link');
const descriptionInputElement = document.querySelector('.js-description');
const resizeElements = document.querySelectorAll('.js-autosize');
const previewElement = document.querySelector('.js-preview');
const addedTagsElement = document.querySelector('.added-tags');
const tagInputElement = document.querySelector('.js-tag-input');
const tagOptionsElement = document.querySelector('.js-tag-options');
const addTagButtonElement = document.querySelector('.js-add-tag-button');
const actionsElement = document.querySelector('.js-actions');
const saveButtonElement = document.querySelector('.js-save');
const openOptionsButtonElement = document.querySelector('.js-open-options');
const openLibraryLinkElement = document.querySelector('.js-open-library');

const saveStatusDisplayStrings = new Map([
  ['new', '💾 Save'],
  ['saving', '💾 Saving…'],
  ['saved', '🙌 Saved'],
  ['error', '❌ Error'],
]);

export class View {
  constructor() {
    autosize(resizeElements);
  }

  handleOutput({ onTitleChange, onTitleSwap, onLinkChange, onDescriptionChange, onAddTag, onRemoveTagByIndex, onSave }) {
    titleInputElement.addEventListener('input', e => onTitleChange(e.target.value));
    titleSwapElement.addEventListener('click', () => onTitleSwap());

    linkInputElement.addEventListener('input', e => onLinkChange(e.target.value));
    descriptionInputElement.addEventListener('input', e => onDescriptionChange(e.target.value));
    addTagButtonElement.addEventListener('click', () => {
      this.sanitizeTagInput();
      onAddTag(tagInputElement.value);
      tagInputElement.value = '';
      tagInputElement.focus();
    });
    tagInputElement.addEventListener('keydown', e => {
      if (tagInputElement.value !== '' && e.key === 'Enter') {
        this.sanitizeTagInput();
        onAddTag(tagInputElement.value);
        tagInputElement.value = '';
      }
      if (tagInputElement.value === '' && e.key === 'Backspace') {
        this.tryFocusLastTag();
      }
    });
    tagInputElement.addEventListener('keyup', e => {
      this.sanitizeTagInput();
    });
    addedTagsElement.addEventListener('click', e => {
      const selectedButton = e.target.closest('button');
      if (!selectedButton) return;
      const removeIndex = parseInt(e.target.closest('button').dataset.index);
      this.removeTagAtIndex(removeIndex, onRemoveTagByIndex);
    });
    addedTagsElement.addEventListener('keydown', e => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const removeIndex = parseInt(e.target.closest('button').dataset.index);
        this.removeTagAtIndex(removeIndex, onRemoveTagByIndex);
      }
    });
    previewElement.addEventListener('focus', () => previewElement.select());
    previewElement.addEventListener('click', () => previewElement.select());

    saveButtonElement.addEventListener('click', onSave);
    openOptionsButtonElement.addEventListener('click', () => chrome.runtime.openOptionsPage());
  }

  render({ state, previousState }) {
    const { title, titleOptions, selectedTitleIndex, href, description, tags, tagOptions, saveStatus, connectionStatus, libraryUrl } = state;

    if (title !== previousState.title) {
      titleInputElement.value = title;
    }
    titleSwapElement.hidden = titleOptions.length === 1;
    if (selectedTitleIndex !== previousState.selectedTitleIndex) {
      dotsElement.innerHTML = titleOptions
        .map((_, index) => index === selectedTitleIndex)
        .map(isSelect => `<span class="${isSelect ? 'dot selected' : 'dot'}"></span>`)
        .join('');
    }

    if (href !== previousState.href) {
      linkInputElement.value = href;
    }

    if (description !== previousState.description) {
      descriptionInputElement.value = description;
    }

    if (tags.join('') !== previousState.tags.join('')) {
      addedTagsElement.innerHTML = tags.map((tag, index) => `<button class="added-tag" data-index=${index}>#${tag}</button>`).join('');
    }

    if (tagOptions.join('') !== previousState.tagOptions.join('')) {
      tagOptionsElement.innerHTML = tagOptions.map(option => `<option value=${option}></option>`).join('');
    }

    const newOutputPreview = this.getPreviewOutput(title, href, description, tags);
    if (previewElement.innerText !== newOutputPreview) {
      previewElement.innerText = newOutputPreview;
    }

    if (saveStatus !== previousState.saveStatus) {
      saveButtonElement.innerText = saveStatusDisplayStrings.get(saveStatus);
    }

    if (libraryUrl !== previousState.libraryUrl) {
      if (libraryUrl && libraryUrl.length) {
        openLibraryLinkElement.href = libraryUrl;
      } else {
        openLibraryLinkElement.removeAttribute('href');
      }
    }

    if (connectionStatus !== previousState.connectionStatus) {
      const isError = connectionStatus === 'error';
      if (isError) {
        openLibraryLinkElement.hidden = true;
        saveButtonElement.hidden = true;
      }
      actionsElement.classList.toggle('has-error', isError);
      openOptionsButtonElement.classList.toggle('has-error', isError);
    }

    autosize.update(resizeElements);
  }

  removeTagAtIndex(index, onRemoveTagByIndex) {
    onRemoveTagByIndex(index);
    const remainingTags = addedTagsElement.querySelectorAll('button');
    const elementToFocus = remainingTags.length ? remainingTags[Math.max(0, index - 1)] : tagInputElement;
    elementToFocus.focus();
  }

  tryFocusLastTag() {
    const remainingTags = addedTagsElement.querySelectorAll('button');
    if (remainingTags.length) {
      remainingTags[remainingTags.length - 1].focus();
    }
  }

  getPreviewOutput(title, href, description, tags) {
    const titleLink = `- [${title}](${href})`;
    const tagList = tags.map(tag => `#${tag}`).join('');
    const outputArray = [titleLink];

    if (description) {
      outputArray.push(description);
    }

    if (tagList.length) {
      outputArray.push(tagList);
    }

    return outputArray.join(' ');
  }

  sanitizeTagInput() {
    // strictly lowercased a-z and 0-9
    tagInputElement.value = tagInputElement.value.toLocaleLowerCase().replace(/[^0-9a-z]/g, '');
  }
}
