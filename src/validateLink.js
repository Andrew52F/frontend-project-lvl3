import * as yup from 'yup';

const validateForm = (link, feedList) => {
  const scheme = yup.string().url().notOneOf(feedList);

  return scheme.validate(link).then(() => null).catch((e) => e.message);
};

export default validateForm;
