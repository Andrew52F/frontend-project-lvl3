import onChange from 'on-change';

const validation = (message, state) => {
  const urlInput = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  feedback.classList.remove('text-danger', 'text-success');
  feedback.textContent = message;
  switch (state) {
    case 'failed':
      urlInput.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      break;
    default:
      urlInput.classList.remove('is-invalid');
      urlInput.focus();
      feedback.classList.add('text-success');
      break;
  }
};

export default (state) => onChange(state, (path, value) => {
  if (path === 'form') {
    const { message, state: formState } = value;
    validation(message, formState);
  }
});
