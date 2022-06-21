import validateLink from './validateLink.js';
import getRssContent from './getRssContent.js';

const handleAddRss = (link, watchedState, i18n) => {
  validateLink(link, watchedState.feeds).then((error) => {
    watchedState.form.error = error;
    if (error) {
      watchedState.form.state = 'failed';
    } else {
      getRssContent(link).catch((err) => {
        if (err.isAxiosError) {
          watchedState.form.error = i18n.t('errors.connectionError');
        } else {
          watchedState.form.error = i18n.t('errors.rssInvalid');
        }
        watchedState.form.state = 'failed';
      })
      .then((feed) => {
        watchedState.feeds.push(feed.feed);
        feed.posts.sort((a, b) => a.pubDate - b.pubDate).forEach((post) => {
          console.log(post.pubDate);
          watchedState.posts.push(post);
        })
        watchedState.form.state = 'success';
      });
    }
  });
};

export default handleAddRss;
