/* eslint-disable no-param-reassign */
import validateLink from './validateLink.js';
import getRssContent from './getRssContent.js';
import updateRss from './updateRss.js';

const handleAddRss = (link, watchedState, i18n) => {
  validateLink(link, watchedState.feeds).then((error) => {
    watchedState.form.error = error;
    if (error) {
      watchedState.form.state = 'failed';
    } else {
      getRssContent(link, watchedState, i18n)
        .then((data) => {
          watchedState.feeds.push(data.feed);
          const sortedNewPosts = data.posts.sort((a, b) => a.pubDate - b.pubDate);
          sortedNewPosts.forEach((newPost) => watchedState.posts.push(newPost));
          watchedState.form.state = 'success';
          updateRss(link, watchedState);
        });
    }
  });
};

export default handleAddRss;
