const applyQueryStringParams = (url, paramMap) =>
  Object.getOwnPropertyNames(paramMap)
    .reduce((accum, curr, idx) => idx === 0 ? `${accum}?${curr}=${paramMap[curr]}` :  `${accum}&${curr}=${paramMap[curr]}`, url);

const isObjectEmpty = (obj) => !!obj && Object.keys(obj).length === 0;

export {
  applyQueryStringParams,
  isObjectEmpty
}