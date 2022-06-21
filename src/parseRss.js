import { uniqueId } from 'lodash';

export default (xml, link) => {
  console.log('parsing');
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const feed = {
    id: uniqueId('F_'),
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    link,
  };
  const posts = Array.from(doc.querySelectorAll('item')).map((item) => ({
    id: uniqueId('P_'),
    feedId: feed.id,
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
    pubDate: new Date(item.querySelector('pubDate').textContent),
  }));
  return { feed, posts };
};
