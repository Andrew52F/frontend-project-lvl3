/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import { setLocale } from 'yup';
import * as yup from 'yup';
import _ from 'lodash';
import initView from './view.js';
import resources from './locales/index.js';
import getRssData from './getRssData.js';

export default () => {
  const state = {
    form: {
      state: 'pending',
      error: null,
    },
    feeds: [],
    posts: [],
    uiState: {
      activePostId: null,
    },
  };
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: () => 'urlUlreadyAdded',
      },
      string: {
        url: () => 'invalidUrl',
      },
    });
  });
  const watchedState = initView(state, i18n);

  const validateLink = (rssLink, feeds) => {
    const feedLinks = feeds.map(({ link }) => link);
    const scheme = yup.string().url().notOneOf(feedLinks);
    return scheme.validate(rssLink).then(() => null).catch((e) => e.message);
  };
  const updateAllFeeds = (ustate) => {
    Promise.all(ustate.feeds.map(({ link }) => getRssData(link, ustate)))
      .then((results) => {
        if (results[0] === undefined) { return; }
        const posts = results.flatMap((result) => result.posts);
        const allPosts = _.union(posts, ustate.posts);
        const newPosts = _.differenceBy(allPosts, ustate.posts, 'link');
        if (newPosts.length !== 0) {
          console.table(newPosts);
          const sortedNewPosts = newPosts.sort((a, b) => a.pubDate - b.pubDate);
          sortedNewPosts.forEach((newPost) => ustate.posts.push(newPost));
        }
      })
      .finally(() => setTimeout(() => {
        updateAllFeeds(ustate);
      }, 5000));
  };
  updateAllFeeds(watchedState);
  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('url').trim();
    validateLink(link, watchedState.feeds).then((error) => {
      if (error) {
        console.log(error);
        watchedState.form.error = error;
        watchedState.form.state = 'failed';
        return;
      }
      getRssData(link, watchedState)
        .then((data) => {
          if (data === undefined) { return; }
          console.log(data);
          watchedState.feeds.push(data.feed);
          const sortedNewPosts = data.posts.sort((a, b) => a.pubDate - b.pubDate);
          sortedNewPosts.forEach((newPost) => watchedState.posts.push(newPost));
          watchedState.form.state = 'success';
        });
    });
  });
};
