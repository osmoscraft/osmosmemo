export function fitTextareaToContent() {
  const fitContainer = document.querySelectorAll('.js-textarea-fit-container');

  fitContainer.forEach((grower) => {
    const textarea = grower.querySelector('textarea');
    (grower as HTMLDivElement).dataset.replicatedValue = textarea.value;
  });
}
