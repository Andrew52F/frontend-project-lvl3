import _ from 'lodash';
import axios from 'axios';
import parseRss from './parseRss.js';

const getRssContent = (link, watchedState, i18n) => {
  const proxy = 'https://allorigins.hexlet.app';
  const url = new URL('/get', proxy);
  url.searchParams.set('url', link);
  url.searchParams.set('disableCache', 'true');
  const existedFeed = watchedState.feeds.find((feed) => feed.link === link);
  const feedId = (existedFeed) ? existedFeed.id : _.uniqueId('F_');

  return axios.get(url).then((response) => parseRss(response.data.contents, link, feedId))
    .catch((err) => {
      if (err.isAxiosError) {
        watchedState.form.error = i18n.t('errors.connectionError');
      } else {
        watchedState.form.error = i18n.t('errors.rssInvalid');
      }
      watchedState.form.state = 'failed';
    });
};

export default getRssContent;
