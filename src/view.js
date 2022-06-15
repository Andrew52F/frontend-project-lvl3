import onChange from 'on-change';

const validationError = (error) => {
  const urlInput = document.querySelector('#url-input');
  if (error) {
    urlInput.classList.add('is-invalid');
  } else {
    urlInput.classList.remove('is-invalid');
    urlInput.focus();
  }
};

export default (state) => onChange(state, (path, value, prevvalue, appyDate) => {
  if (path === 'form.error') {
    validationError(value);
  }
});
