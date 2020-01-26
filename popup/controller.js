import { b64EncodeUnicode, b64DecodeUnicode } from '../shared/utils/base64.js';

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
      const headers = new Headers({
        Authorization: 'Basic ' + btoa('chuanqisun:' + data.accessToken),
        'Content-Type': 'application/json',
      });
      try {
        const latestContent = await fetch('https://api.github.com/repos/chuanqisun/wiki/contents/test.md').then(res => res.json());
        const decodedLatestContentString = b64DecodeUnicode(latestContent.content);

        const { title, href, description, tags } = this.model.state;
        const entryString = this.view.getPreviewOutput(title, href, description, tags);
        const updatedString = decodedLatestContentString.replace('# Wiki', `# Wiki\n${entryString}`);

        await fetch('https://api.github.com/repos/chuanqisun/wiki/contents/test.md', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            message: 'New summary added by Markdown Page Summary',
            content: b64EncodeUnicode(updatedString),
            sha: latestContent.sha,
          }),
        }).then(res => res.json());
        this.model.update({ saveStatus: 'saved' });
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
      chrome.tabs.sendMessage(tabs[0].id, { command: 'cache-model', data: { ...this.model.state, saveStatus: 'new' } });
    });
  }
}
