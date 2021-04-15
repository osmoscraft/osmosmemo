import { browser } from 'webextension-polyfill-ts';
import { insertContent, getLibraryUrl, getContentString } from '../shared/github/rest-api';
import { getUniqueTagsFromMarkdownString } from '../shared/utils/tags';
import type { Model } from './model';
import type { View } from './view';
import type { Options } from '../background';

export class Controller {
  constructor(private model: Model, private view: View) {
    this.init();
  }

  async init() {
    this.view.handleOutput({
      onTitleChange: (title) => this.model.updateAndCache({ title }),
      onTitleSwap: () => {
        const newIndex = (this.model.state.selectedTitleIndex + 1) % this.model.state.titleOptions.length;
        return this.model.updateAndCache({
          selectedTitleIndex: newIndex,
          title: this.model.state.titleOptions[newIndex],
        });
      },
      onLinkChange: (href) => this.model.updateAndCache({ href }),
      onDescriptionChange: (description) => this.model.updateAndCache({ description }),
      onAddTag: (tag) => this.model.updateAndCache({ tags: [...this.model.state.tags, tag] }),
      onRemoveTagByIndex: (index) => this.model.updateAndCache({ tags: this.model.state.tags.filter((_, i) => i !== index) }),
      onSave: () => this.onSave(),
    });

    this.model.emitter.addEventListener('update', (e) => {
      const { state, previousState, shouldCache } = (e as CustomEvent).detail;
      this.view.render({ state, previousState });
      if (shouldCache) {
        this.cacheModel();
      }
    });

    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        for (let key in changes) {
          if (key === 'tags') {
            const storageChange = changes[key];
            this.model.update({ tagOptions: storageChange.newValue });
          }
        }
      }
    });

    const tagsData = await browser.storage.sync.get('tags');
    this.model.update({ tagOptions: tagsData.tags });

    const optionsData: Options = await browser.storage.sync.get(['accessToken', 'username', 'repo', 'filename']);
    const { accessToken, username, repo, filename } = optionsData;
    try {
      const markdownString = await getContentString({ accessToken, username, repo, filename });
      const libraryUrl = getLibraryUrl({ username, repo, filename });
      this.model.update({ libraryUrl, connectionStatus: 'valid' });

      // Get latest tags and write to storage. The change listener will fire and push changes to model
      const uniqueTags = await getUniqueTagsFromMarkdownString(markdownString);
      browser.storage.sync.set({ tags: uniqueTags });
    } catch (e) {
      this.model.update({ connectionStatus: 'error' });
    }
  }

  async onSave() {
    this.model.update({ saveStatus: 'saving' });
    const optionsData = await browser.storage.sync.get(['accessToken', 'username', 'repo', 'filename']);
    try {
      const { accessToken, username, repo, filename } = optionsData;
      const { title, href, description, tags } = this.model.state;
      const newEntryString = this.view.getPreviewOutput(title, href, description, tags);
      await insertContent({ accessToken, username, repo, filename, content: newEntryString });
      this.model.update({ saveStatus: 'saved' });
    } catch {
      this.model.update({ saveStatus: 'error' });
    }
  }

  onData({ title, headings, href }) {
    const titleOptions = [...new Set([...headings.map((heading) => heading.trim()), title.trim()])].filter((option) => option.length > 0);
    this.model.update({ title: titleOptions[0], selectedTitleIndex: 0, titleOptions, href, saveStatus: 'new' });
  }

  onCache(cachedModel) {
    this.model.update(cachedModel);
  }

  async cacheModel() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    browser.tabs.sendMessage(tabs[0].id, { command: 'set-cached-model', data: this.model.getCacheableState() });
  }
}
