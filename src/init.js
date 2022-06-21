import i18next from 'i18next';
import { setLocale } from 'yup';
import handleAddRss from './handlers.js';
import initView from './view.js';
import resources from './locales/index.js';

export default () => {
  const state = {
    form: {
      state: 'filiing',
      error: null,
    },
    feeds: [],
    posts: [],

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
    handleAddRss(link, watchedState, i18n);
  });
};
