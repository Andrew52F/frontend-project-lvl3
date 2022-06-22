import _ from 'lodash';
import getRssContent from './getRssContent.js';

const updateRss = (link, watchedState, i18n) => {
  getRssContent(link, watchedState, i18n)
    .then((data) => {
      const allPosts = _.union(data.posts, watchedState.posts);
      const newPosts = _.differenceBy(allPosts, watchedState.posts, 'link');
      if (newPosts.length !== 0) {
        console.table(newPosts);
        const sortedNewPosts = newPosts.sort((a, b) => a.pubDate - b.pubDate);
        sortedNewPosts.forEach((newPost) => watchedState.posts.push(newPost));
      }
    })
    .then(() => setTimeout(() => updateRss(link, watchedState), 5000));
};
export default updateRss;
