export class Model {
  constructor(
    state = {
      title: undefined,
      titleOptions: [],
      selectedTitleIndex: undefined,
      href: undefined,
      description: '',
      tags: [],
      tagOptions: [],
      libraryUrl: undefined,
      saveStatus: 'new', // 'new' | 'saving' | 'saved' | 'error',
      connectionStatus: 'unknown', // 'unknown' | 'valid' | 'error'
    }
  ) {
    this.state = state;
    this.emitter = document.createElement('div');
  }

  getCacheableState() {
    const { title, titleOptions, selectedTitleIndex, href, description, tags } = this.state;
    return {
      title,
      titleOptions,
      selectedTitleIndex,
      href,
      description,
      tags,
    };
  }

  update(delta) {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...delta };
    this.emitter.dispatchEvent(
      new CustomEvent('update', {
        detail: {
          state: this.state,
          previousState,
        },
      })
    );
  }
}
