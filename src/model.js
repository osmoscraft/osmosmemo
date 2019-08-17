export class Model {
  constructor(
    state = {
      title: '',
      titleOptions: [],
      selectedTitleIndex: undefined,
      href: '',
      description: '',
      tags: [],
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
