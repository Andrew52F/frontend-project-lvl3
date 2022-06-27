/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';

const requestRss = (link) => {
  const proxy = 'https://allorigins.hexlet.app';
  const url = new URL('/get', proxy);
  url.searchParams.set('url', link);
  url.searchParams.set('disableCache', 'true');
  return axios.get(url);
};

const parseRss = (xml) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const feed = {
      title: doc.querySelector('title').textContent,
      description: doc.querySelector('description').textContent,
    };
    const posts = Array.from(doc.querySelectorAll('item')).map((item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      pubDate: new Date(item.querySelector('pubDate').textContent),
    }));
    return { feed, posts };
  } catch (e) {
    throw new Error('parsing error');
  }
};
const normalizeData = (data, state) => {
  const existedFeed = state.feeds.find((feed) => feed.link === data.feed.link);
  const feedId = (existedFeed) ? existedFeed.id : _.uniqueId('F_');
  data.feed.id = feedId;
  data.posts.reverse().forEach((post) => {
    post.id = _.uniqueId('P_');
    post.feedId = feedId;
  });
  return data;
};
export default (link, state) => requestRss(link)
  .then((response) => parseRss(response.data.contents))
  .then((data) => {
    data.feed.link = link;
    return normalizeData(data, state);
  }).catch((err) => {
    if (err.isAxiosError) {
      state.form.error = 'connectionError';
    } else if (err.message === 'parsing error') {
      state.form.error = 'invalidRss';
    } else {
      state.form.error = null;
    }

    state.form.state = 'failed';
  });
