/* eslint-disable no-param-reassign */
import _ from 'lodash';
import validateLink from './validateLink.js';
import getRssContent from './getRssContent.js';

const handleAddRss = (link, watchedState, i18n) => {
  validateLink(link, watchedState.feeds).then((error) => {
    watchedState.form.error = error;
    if (error) {
      watchedState.form.state = 'failed';
    } else {
      (function updateRss(rssLink, updatedWatchedState) {
        const existedFeed = updatedWatchedState.feeds.find((feed) => feed.link === link);
        const feedId = (existedFeed) ? existedFeed.id : _.uniqueId('F_');
        getRssContent(rssLink, feedId)
          .then((data) => {
            if (!existedFeed) {
              updatedWatchedState.feeds.push(data.feed);
              watchedState.form.state = 'success';
            }
            const allPosts = _.union(data.posts, updatedWatchedState.posts);
            const newPosts = _.differenceBy(allPosts, updatedWatchedState.posts, 'link');
            if (newPosts.length !== 0) {
              console.table(newPosts);
              const sortedNewPosts = newPosts.sort((a, b) => a.pubDate - b.pubDate);
              sortedNewPosts.forEach((newPost) => updatedWatchedState.posts.push(newPost));
            }
          })
          .then(() => setTimeout(() => updateRss(rssLink, updatedWatchedState), 5000))
          .catch((err) => {
            if (err.isAxiosError) {
              updatedWatchedState.form.error = i18n.t('errors.connectionError');
            } else {
              updatedWatchedState.form.error = i18n.t('errors.rssInvalid');
            }
            updatedWatchedState.form.state = 'failed';
          });
      }(link, watchedState));
    }
  });
};

export default handleAddRss;
