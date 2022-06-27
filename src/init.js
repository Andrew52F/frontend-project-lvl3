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
      state: 'filiing',
      error: null,
    },
    feeds: [],
    posts: [],
    updateRssStatus: 'off',
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
  const feedLinks = [];
  const updateAllFeeds = (link) => {
    feedLinks.push(link);
    const updateRss = () => {
      Promise.all(feedLinks.map((l) => getRssData(l, watchedState)))
        .then((datas) => {
          const posts = datas.flatMap((result) => result.posts);
          const allPosts = _.union(posts, watchedState.posts);
          const newPosts = _.differenceBy(allPosts, watchedState.posts, 'link');
          if (newPosts.length !== 0) {
            console.table(newPosts);
            const sortedNewPosts = newPosts.sort((a, b) => a.pubDate - b.pubDate);
            sortedNewPosts.forEach((newPost) => watchedState.posts.push(newPost));
          }
        })
        .finally(() => setTimeout(() => {
          updateRss(watchedState);
        }, 5000));
    };
    if (watchedState.updateRssStatus === 'off') {
      watchedState.updateRssStatus = 'on';
      setTimeout(() => {
        updateRss(watchedState);
      }, 5000);
    }
  };

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('url').trim();
    validateLink(link, watchedState.feeds).then((error) => {
      watchedState.form.error = error;
      if (error) {
        watchedState.form.state = 'failed';
        return;
      }
      getRssData(link, state)
        .then((data) => {
          console.log(data);
          watchedState.feeds.push(data.feed);
          const sortedNewPosts = data.posts.sort((a, b) => a.pubDate - b.pubDate);
          sortedNewPosts.forEach((newPost) => watchedState.posts.push(newPost));
          watchedState.form.state = 'success';
          e.target.reset();
          updateAllFeeds(link, watchedState);
        });
    });
  });
};
