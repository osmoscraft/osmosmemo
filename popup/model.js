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
    }
  ) {
    this.state = state;
    this.emitter = document.createElement('div');
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
