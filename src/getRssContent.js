import axios from 'axios';
import parseRss from './parseRss.js';

const getRssContent = (link) => {
  const proxy = 'https://allorigins.hexlet.app';
  const url = new URL('/get', proxy);
  url.searchParams.set('url', link);
  url.searchParams.set('disableCache', 'true');

  return axios.get(url).then((response) => parseRss(response.data.contents, link));
};

export default getRssContent;
