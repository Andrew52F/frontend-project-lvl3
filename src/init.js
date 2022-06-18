import i18next from 'i18next';
import { setLocale } from 'yup';
import initView from './view.js';
import validateLink from './validateLink.js';
import resources from './locales/index.js';

export default () => {
  const state = {
    form: {
      state: 'filiing',
      feedback: null,
    },
    feedList: [],

  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    setLocale({
      mixed: {
        notOneOf: () => i18n.t('errors.urlExists'),
      },
      string: {
        url: () => i18n.t('errors.urlInvalid'),
      },
    });
  });

  const watchedState = initView(state, i18n);

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const link = data.get('url').trim();
    validateLink(link, state.feedList, i18next).then((error) => {
      if (!error && !state.feedList.includes(link)) {
        state.feedList.push(link);
      }
      watchedState.form = error ? { message: error, state: 'failed' } : { message: i18n.t('success'), state: 'success' };
    });
  });
};
