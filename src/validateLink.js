import * as yup from 'yup';

const validateForm = (rssLink, feeds) => {
  const feedLinks = feeds.map(({ link }) => link);
  const scheme = yup.string().url().notOneOf(feedLinks);

  return scheme.validate(rssLink).then(() => null).catch((e) => e.message);
};

export default validateForm;
