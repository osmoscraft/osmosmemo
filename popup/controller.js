import { insertContent } from '../shared/github/rest-api.js';

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.view.handleOutput({
      onTitleChange: title => this.model.update({ title }),
      onTitleSwap: () => {
        const newIndex = (this.model.state.selectedTitleIndex + 1) % this.model.state.titleOptions.length;
        return this.model.update({
          selectedTitleIndex: newIndex,
          title: this.model.state.titleOptions[newIndex],
        });
      },
      onLinkChange: href => this.model.update({ href }),
      onDescriptionChange: description => this.model.update({ description }),
      onAddTag: tag => this.model.update({ tags: [...this.model.state.tags, tag] }),
      onRemoveTagByIndex: index => this.model.update({ tags: this.model.state.tags.filter((_, i) => i !== index) }),
      onSave: () => this.onSave(),
    });

    this.model.emitter.addEventListener('update', e => {
      const { state, previousState } = e.detail;
      this.view.render({ state, previousState });
      this.cacheModel();
    });

    chrome.storage.sync.get('tags', async data => {
      this.model.update({ tagOptions: data.tags });
    });
  }

  onSave() {
    this.model.update({ saveStatus: 'saving' });
    chrome.storage.sync.get('accessToken', async (/** @type { Options } */ data) => {
      try {
        chrome.storage.sync.get(['accessToken', 'username', 'repo', 'filename'], async (/** @type {Options} */ data) => {
          const { accessToken, username, repo, filename } = data;
          const { title, href, description, tags } = this.model.state;
          const newEntryString = this.view.getPreviewOutput(title, href, description, tags);
          await insertContent({ accessToken, username, repo, filename, content: newEntryString });
          this.model.update({ saveStatus: 'saved' });
        });
      } catch {
        this.model.update({ saveStatus: 'error' });
      }
    });
  }

  onData({ title, headings, href }) {
    const titleOptions = [...new Set([...headings.map(heading => heading.trim()), title.trim()])].filter(option => option.length > 0);
    this.model.update({ title: titleOptions[0], selectedTitleIndex: 0, titleOptions, href, saveStatus: 'new' });
  }

  onCache(cachedModel) {
    this.model.update(cachedModel);
  }

  cacheModel() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'cache-model', data: this.model.getCacheableState() });
    });
  }
}
