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
  article.textContent = post.description;
  linkButton.setAttribute('href', post.link);
  linkButton.textContent = i18n.t('modal.readArticle');
  closeBtns[1].textContent = i18n.t('modal.closeModal');
};
const buildFeed = (feed) => {
  const feedCard = document.createElement('li');
  feedCard.classList.add('list-group-item', 'border-0', 'border-end-0');
  const title = document.createElement('h3');
  title.classList.add('h6', 'm-0');
  title.textContent = feed.title;
  const description = document.createElement('p');
  description.classList.add('m-0', 'small', 'text-black-50');
  description.textContent = feed.description;
  feedCard.append(title, description);
  return feedCard;
};
const buildPost = (post, state, i18n) => {
  const postCard = document.createElement('li');
  postCard.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const title = document.createElement('a');
  title.setAttribute('href', post.link);
  title.classList.add('fw-bold');
  title.setAttribute('target', '_blank');
  title.setAttribute('rel', 'noopener noreferrer');
  title.textContent = post.title;
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('type', 'button');
  button.dataset.postId = post.id;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = i18n.t('modal.showModal');
  postCard.append(title, button);
  return postCard;
};
const setList = (section, i18n, state) => {
  const isPosts = section.classList.contains('posts');
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = isPosts ? i18n.t('posts') : i18n.t('feeds');
  cardBody.append(cardTitle);
  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  if (isPosts) {
    postsList.addEventListener('click', (e) => {
      if (e.target.dataset.postId) {
        const { postId } = e.target.dataset;
        console.log(postId);
        state.uiState.activePostId = postId;
      }
    });
  }
  card.append(cardBody, postsList);
  section.prepend(card);
};
export default (state, i18n) => {
  const watchedState = onChange(state, (path, value, prev, diff) => {
    const urlInput = document.querySelector('#url-input');
    const feedback = document.querySelector('.feedback');
    const feedsSection = document.querySelector('.feeds');
    const postsSection = document.querySelector('.posts');
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
          urlInput.classList.add('is-invalid');
          break;
        default:
          console.log('default');
          break;
      }
    }
    if (path === 'form.error') {
      switch (value) {
        case 'urlUlreadyAdded':
          feedback.textContent = i18n.t('errors.urlUlreadyAdded');
          break;
        case 'connectionError':
          feedback.textContent = i18n.t('errors.connectionError');
          break;
        case 'invalidRss':
          feedback.textContent = i18n.t('errors.invalidRss');
          break;
        default:
          feedback.textContent = i18n.t('errors.invalidUrl');
      }
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
    }
    if (path === 'feeds') {
      if (feedsSection.innerHTML === '') {
        setList(feedsSection, i18n);
      }
      const feedsList = feedsSection.querySelector('.list-group');
      feedsList.prepend(buildFeed(diff.args[0], i18n));
    }
    if (path === 'posts') {
      if (postsSection.innerHTML === '') {
        setList(postsSection, i18n, watchedState);
      }
      const postsList = postsSection.querySelector('.list-group');
      postsList.prepend(buildPost(diff.args[0], state, i18n));
    }
    if (path === 'uiState.activePostId') {
      const post = state.posts.find((p) => p.id === value);
      showModal(post, i18n);
    }
  });
  return watchedState;
};
