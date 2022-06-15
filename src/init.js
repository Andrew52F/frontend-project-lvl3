import initView from './view.js';
import validateLink from './validateLink.js';

export default () => {
  const state = {
    form: {
      state: 'filiing',
      error: [],
    },
    feedList: [],

  };

  const watchedState = initView(state);

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const link = data.get('url').trim();
    validateLink(link, state.feedList).then((error) => {
      if (!error && !state.feedList.includes(link)) {
        state.feedList.push(link);
      }
      console.log(`error ${error}`);
      watchedState.form.error = error;
    });
  });
};
