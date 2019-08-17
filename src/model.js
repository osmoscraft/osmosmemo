export class Model {
  constructor(
    state = {
      title: '',
      href: '',
      description: '',
      tags: [],
    }
  ) {
    this.state = state;
    this.emitter = document.createElement('div');
  }

  update(delta) {
    this.state = { ...this.state, ...delta };
    this.emitter.dispatchEvent(new CustomEvent('update', { detail: this.state }));
  }
}
