export interface ModelState {
  title?: string;
  titleOptions: string[];
  selectedTitleIndex?: number;
  href?: string;
  description: string;
  tags: string[];
  tagOptions: string[];
  libraryUrl?: string;
  saveStatus: "new" | "saving" | "saved" | "error";
  connectionStatus: "unknown" | "valid" | "error";
}

export class Model {
  get state(): ModelState {
    return this._state;
  }

  private _state: ModelState = {
    title: undefined,
    titleOptions: [],
    selectedTitleIndex: undefined,
    href: undefined,
    description: "",
    tags: [],
    tagOptions: [],
    libraryUrl: undefined,
    saveStatus: "new", // 'new' | 'saving' | 'saved' | 'error',
    connectionStatus: "unknown", // 'unknown' | 'valid' | 'error'
  };
  emitter = document.createElement("div");

  getCacheableState() {
    const { title, titleOptions, selectedTitleIndex, href, description, tags } = this._state;
    return {
      title,
      titleOptions,
      selectedTitleIndex,
      href,
      description,
      tags,
    };
  }

  updateAndCache(delta) {
    this.update(delta, true);
  }

  update(delta, shouldCache = false) {
    const previousState = { ...this._state };
    this._state = { ...this._state, ...delta };
    this.emitter.dispatchEvent(
      new CustomEvent("update", {
        detail: {
          state: this._state,
          previousState,
          shouldCache,
        },
      })
    );
  }
}
