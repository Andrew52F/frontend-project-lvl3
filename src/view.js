/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import 'bootstrap';

const showModal = (post, i18n) => {
  const modal = document.querySelector('#modal');
  const title = modal.querySelector('.modal-title');
  const article = modal.querySelector('.modal-body');
  const linkButton = modal.querySelector('.full-article');
  const closeBtns = document.querySelectorAll('[data-bs-dismiss="modal"]');
  title.textContent = post.title;
  article.innerHTML = post.description;
  linkButton.setAttribute('href', post.link);
  linkButton.innerText = i18n.t('modal.readArticle');
  closeBtns[1].innerText = i18n.t('modal.closeModal');
};

const buildPost = (post, state, i18n) => {
  const postCard = document.createElement('li');
  postCard.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const title = document.createElement('a');
  title.setAttribute('href', post.link);
  title.classList.add('fw-bold');
  title.setAttribute('target', '_blank');
  title.setAttribute('rel', 'noopener noreferrer');
  title.innerText = post.title;
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('type', 'button');
  button.dataset.id = post.id;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.innerText = i18n.t('modal.showModal');
  button.addEventListener('click', () => {
    console.log('bibi');
    state.uiState.shownPostsIds.push(post.id);
    showModal(post, i18n);
    title.classList.remove('fw-bold');
    title.classList.add('fw-normal', 'link-secondary');
  });
  postCard.append(title, button);
  return postCard;
};
const setPostsList = (postsSection, i18n) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.innerText = i18n.t('posts');
  cardBody.append(cardTitle);
  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(cardBody, postsList);
  postsSection.prepend(card);
};
const renderPosts = (post, state, i18n) => {
  const postsSection = document.querySelector('.posts');
  if (postsSection.innerHTML === '') {
    setPostsList(postsSection, i18n);
    // setModal(i18n);
  }
  const postsList = postsSection.querySelector('.list-group');
  postsList.prepend(buildPost(post, state, i18n));
};

const buildFeed = (feed) => {
  const feedCard = document.createElement('li');
  feedCard.classList.add('list-group-item', 'border-0', 'border-end-0');
  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.innerText = feed.title;
  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.innerText = feed.description;
  feedCard.append(title, description);
  return feedCard;
};
const renderFeeds = (feed, i18n) => {
  const feedsSection = document.querySelector('.feeds');
  if (feedsSection.innerHTML === '') {
    setPostsList(feedsSection, i18n);
  }
  const feedsList = feedsSection.querySelector('.list-group');
  feedsList.prepend(buildFeed(feed, i18n));
};
export default (state, i18n) => onChange(state, (path, value, prev, diff) => {
  const urlInput = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  if (path === 'form.state') {
    switch (value) {
      case 'waiting':
        console.log('waiting');
        break;
      case 'success':
        console.log('success');
        urlInput.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        urlInput.focus();
        urlInput.value = '';
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('success');
        break;
      case 'failed':
        console.log('failed');
        feedback.textContent = state.form.error;
        feedback.classList.remove('text-success');
        urlInput.classList.add('is-invalid');
        feedback.classList.add('text-danger');
        break;
      default:
        console.log('default');
        break;
    }
  }
  if (path === 'feeds') {
    renderFeeds(diff.args[0], i18n);
  }
  if (path === 'posts') {
    renderPosts(diff.args[0], state, i18n);
  }
});
