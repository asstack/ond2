const {injectBabelPlugin} = require('react-app-rewired');

module.exports = function override(config, env) {
  config = injectBabelPlugin(['transform-semantic-ui-react-imports',
    {
      "convertMemberImports": true,
      "importType": "es",
      "addCssImports": true,
      "importMinifiedCssFiles": true,
      "addLessImports": false,
      "addDuplicateStyleImports": false
    }], config);

  return config;
};