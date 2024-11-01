import { getContentString, getLibraryUrl, updateContent } from "../lib/github/rest-api";
import { getEntryPatternByHref, parseEntry } from "../lib/utils/markdown";
import { mergeContent } from "../lib/utils/merge-content";
import { truncateString } from "../lib/utils/string";
import { getUniqueTagsFromMarkdownString } from "../lib/utils/tags";
import { getUserOptions } from "../lib/utils/user-options";
import type { CacheableModel, FullModel, Model } from "./model";
import type { View } from "./view";

export class Controller {
  constructor(private model: Model, private view: View) {
    this.init();
  }

  async init() {
    this.view.handleOutput({
      onTitleChange: (title) => this.model.updateAndCache({ title }),
      onLinkChange: (href) => {
        // when link changes, Saved status must be recalculated
        const savedModel = this.findSavedModel(href, this.model.state.markdownString) ?? undefined;
        this.model.update({ ...savedModel, isSaved: !!savedModel });
        this.model.updateAndCache({ href });
      },
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
      const savedModel = this.findSavedModel(this.model.state.href, markdownString) ?? undefined;
      this.model.update({
        tagOptions,
        libraryUrl,
        connectionStatus: "valid",
        markdownString,
        isSaved: !!savedModel,
        ...(this.model.state.isCacheLoaded ? undefined : savedModel), // Cache takes precedence over saved model
      });
      console.log(`[controller] Model updated from GitHub`);
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
      const mergeWithExisting = mergeContent.bind(null, href!, newEntryString);
      const message = truncateString(
        [title, description, href]
          .map((str) => str?.trim())
          .filter(Boolean)
          .join(" "),
        64
      );
      const updatedContent = await updateContent({ accessToken, username, repo, filename, message }, mergeWithExisting);
      this.model.update({ saveStatus: "saved", markdownString: updatedContent, isSaved: true });
    } catch {
      this.model.update({ saveStatus: "error" });
    }
  }

  onData({ title, href, cacheKey }: Partial<FullModel>) {
    const savedModel = this.findSavedModel(href, this.model.state.markdownString) ?? undefined;
    this.model.update({ title: title, href, cacheKey, saveStatus: "new", ...savedModel, isSaved: !!savedModel });
    console.log(`[controller] Model updated from new page parser`);
  }

  onCache(cachedModel: CacheableModel) {
    const savedModel = this.findSavedModel(cachedModel.href!, this.model.state.markdownString) ?? undefined;
    // Let cache override any existing state
    this.model.update({ ...cachedModel, isCacheLoaded: true, isSaved: !!savedModel });
    console.log(`[controller] Model updated from session cache`);
  }

  private findSavedModel(href?: string, remoteMarkdown?: string) {
    if (!remoteMarkdown) return null;
    if (!href) return null;

    const match = remoteMarkdown?.match(getEntryPatternByHref(href));
    if (!match) return null;

    return match ? parseEntry(match[0]) : null;
  }

  async cacheModel() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs?.[0]?.id) {
      console.error(`[controller] cannot cache model. Activie tab does not exist.`);
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { command: "set-cached-model", data: this.model.getCacheableState() });
  }
}
