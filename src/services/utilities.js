const applyQueryStringParams = (url, paramMap) =>
  Object.getOwnPropertyNames(paramMap)
    .reduce((accum, curr, idx) => idx === 0 ? `${accum}?${curr}=${paramMap[curr]}` :  `${accum}&${curr}=${paramMap[curr]}`, url);

export {
  applyQueryStringParams
}