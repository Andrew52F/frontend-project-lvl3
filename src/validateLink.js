import * as yup from 'yup';

const validateForm = (link, feeds) => {
  const feedLinks = feeds.map(({link}) => link);
  const scheme = yup.string().url().notOneOf(feedLinks);

  return scheme.validate(link).then(() => null).catch((e) => e.message);
};

export default validateForm;
