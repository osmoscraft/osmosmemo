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
      const { title, titleOptions, href, description, tags } = e.detail;
      this.view.render({ title, titleOptions, href, description, tags, originalState: this.model.originalState });
    });
  }

  onData({ title, headings, href }) {
    const titleOptions = [...new Set([title.trim(), ...headings.map(heading => heading.trim())])];
    this.model.update({ title, titleOptions, href });
  }
}
