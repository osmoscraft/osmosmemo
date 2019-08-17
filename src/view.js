/* Input elements */
const titleInputElement = document.querySelector('.js-title');
const titleSwapElement = document.querySelector('.js-title-swap');
const dotsElement = document.querySelector('.js-dots');
const linkInputElement = document.querySelector('.js-link');
const descriptionInputElement = document.querySelector('.js-description');
const resizeElements = document.querySelectorAll('.js-autosize');
const outputElement = document.querySelector('.js-output');
const addedTagsElement = document.querySelector('.added-tags');
const tagInputElement = document.querySelector('.js-tag-input');
const addTagButtonElement = document.querySelector('.js-add-tag-button');
const copyButtonElement = document.querySelector('.js-copy');

export class View {
  constructor() {
    autosize(resizeElements);
  }

  handleOutput({ onTitleChange, onTitleSwap, onLinkChange, onDescriptionChange, onAddTag, onRemoveTagByIndex }) {
    titleInputElement.addEventListener('input', e => onTitleChange(e.target.value));
    titleSwapElement.addEventListener('click', () => onTitleSwap());

    linkInputElement.addEventListener('input', e => onLinkChange(e.target.value));
    descriptionInputElement.addEventListener('input', e => onDescriptionChange(e.target.value));
    addTagButtonElement.addEventListener('click', () => {
      if (tagInputElement.value !== '') {
        onAddTag(tagInputElement.value);
        tagInputElement.value = '';
        tagInputElement.focus();
      }
    });
    tagInputElement.addEventListener('keydown', e => {
      if (tagInputElement.value !== '' && e.key === 'Enter') {
        onAddTag(tagInputElement.value);
        tagInputElement.value = '';
      }
      if (tagInputElement.value === '' && e.key === 'Backspace') {
        this.tryFocusLastTag();
      }
    });
    addedTagsElement.addEventListener('click', e => {
      const removeIndex = parseInt(e.target.closest('button').dataset.index);
      this.removeTagAtIndex(removeIndex, onRemoveTagByIndex);
    });
    addedTagsElement.addEventListener('keydown', e => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const removeIndex = parseInt(e.target.closest('button').dataset.index);
        this.removeTagAtIndex(removeIndex, onRemoveTagByIndex);
      }
    });
    outputElement.addEventListener('focus', () => outputElement.select());
    outputElement.addEventListener('click', () => outputElement.select());
    copyButtonElement.addEventListener('click', () => {
      outputElement.select();
      document.execCommand('copy');
      copyButtonElement.innerText = 'Copy - Done';
    });
  }

  render({ state, previousState }) {
    const { title, titleOptions, selectedTitleIndex, href, description, tags } = state;

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

    const output = `[${title}](${href}) ${description} ${tags.map(tag => `#${tag}`).join('')}`;
    outputElement.innerText = output;

    if (copyButtonElement.innerText.includes('Done')) {
      copyButtonElement.innerText = 'Copy';
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
}
