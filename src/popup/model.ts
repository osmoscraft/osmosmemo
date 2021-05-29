export interface FullModel extends CacheableModel {
  description: string;
  tags: string[];
  tagOptions: string[];
  libraryUrl?: string;
  saveStatus: "new" | "saving" | "saved" | "error";
  connectionStatus: "unknown" | "valid" | "error";
}

export interface CacheableModel {
  title?: string;
  href?: string;
  cacheKey?: string;
  description?: string;
  tags?: string[];
}

export class Model {
  get state(): FullModel {
    return this._state;
  }

  private _state: FullModel = {
    title: undefined,
    href: undefined,
    cacheKey: undefined,
    description: "",
    tags: [],
    tagOptions: [],
    libraryUrl: undefined,
    saveStatus: "new", // 'new' | 'saving' | 'saved' | 'error',
    connectionStatus: "unknown", // 'unknown' | 'valid' | 'error'
  };
  emitter = document.createElement("div");

  getCacheableState(): CacheableModel {
    const { title, href, cacheKey, description, tags } = this._state;
    return {
      title,
      href,
      cacheKey,
      description,
      tags,
    };
  }

  updateAndCache(delta: Partial<FullModel>) {
    this.update(delta, true);
  }

  update(delta: Partial<FullModel>, shouldCache = false) {
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
