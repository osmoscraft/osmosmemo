import browser from "webextension-polyfill";
import { getContentString, getLibraryUrl, insertContent } from "../lib/github/rest-api";
import { getUniqueTagsFromMarkdownString } from "../lib/utils/tags";
import { getUserOptions } from "../lib/utils/user-options";
import type { CacheableModel, Model, FullModel } from "./model";
import type { View } from "./view";

export class Controller {
  constructor(private model: Model, private view: View) {
    this.init();
  }

  async init() {
    this.view.handleOutput({
      onTitleChange: (title) => this.model.updateAndCache({ title }),
      onLinkChange: (href) => this.model.updateAndCache({ href }),
      onDescriptionChange: (description) => this.model.updateAndCache({ description }),
      onAddTag: (tag) => this.model.updateAndCache({ tags: [...this.model.state.tags, tag] }),
      onRemoveTagByIndex: (index) =>
        this.model.updateAndCache({ tags: this.model.state.tags.filter((_, i) => i !== index) }),
      onSave: () => this.onSave(),
    });

    this.model.emitter.addEventListener("update", (e) => {
      const { state, previousState, shouldCache } = (e as CustomEvent).detail;
      this.view.render({ state, previousState });
      if (shouldCache) {
        this.cacheModel();
      }
    });

    const optionsData = await getUserOptions();
    this.model.update({ tagOptions: optionsData.tagOptions });

    const { accessToken, username, repo, filename } = optionsData;
    try {
      const markdownString = await getContentString({ accessToken, username, repo, filename });
      const libraryUrl = await getLibraryUrl({ accessToken, username, repo, filename });
      const tagOptions = await getUniqueTagsFromMarkdownString(markdownString);
      this.model.update({ tagOptions, libraryUrl, connectionStatus: "valid" });
      console.log(`[controller] tags available`, tagOptions.length);
    } catch (e) {
      this.model.update({ connectionStatus: "error" });
    }
  }

  async onSave() {
    if (!this.view.validateForm()) {
      return;
    }

    this.model.update({ saveStatus: "saving" });
    const optionsData = await getUserOptions();
    try {
      const { accessToken, username, repo, filename } = optionsData;
      const { title, href, description, tags } = this.model.state;
      const newEntryString = this.view.getPreviewOutput(title, href, description, tags);
      await insertContent({ accessToken, username, repo, filename, content: newEntryString });
      this.model.update({ saveStatus: "saved" });
    } catch {
      this.model.update({ saveStatus: "error" });
    }
  }

  onData({ title, href, cacheKey }: Partial<FullModel>) {
    this.model.update({ title: title, href, cacheKey, saveStatus: "new" });
  }

  onCache(cachedModel: CacheableModel) {
    this.model.update(cachedModel);
  }

  async cacheModel() {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (!tabs?.[0]?.id) {
      console.error(`[controller] cannot cache model. Activie tab does not exist.`);
      return;
    }

    browser.tabs.sendMessage(tabs[0].id, { command: "set-cached-model", data: this.model.getCacheableState() });
  }
}
