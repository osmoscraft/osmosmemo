export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    this.view.handleOutput({
      onTitleChange: title => this.model.update({ title }),
      onLinkChange: href => this.model.update({ href }),
      onDescriptionChange: description => this.model.update({ description }),
      onAddTag: tag => this.model.update({ tags: [...this.model.state.tags, tag] }),
      onRemoveTagByIndex: index => this.model.update({ tags: this.model.state.tags.filter((_, i) => i !== index) }),
    });

    this.model.emitter.addEventListener('update', e => {
      const { title, href, description, tags } = e.detail;
      const output = `[${title}](${href}) ${description} ${tags.map(tag => `#${tag}`).join('')}`;
      this.view.render({ title, href, description, output, tags, originalState: this.model.originalState });
    });
  }

  onData({ title, headings, href, hostname }) {
    this.model.update({ title, href });
  }
}
