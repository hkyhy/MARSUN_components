const path = require('path');
const nestedModulesPlugin = require('./scripts/craco-nested-modules-plugin');
const aliasConfig = require('./webstorm.webpack.config');

process.env.CI = false;

const maoyangSrc = path.resolve(__dirname, '../maoyang_data-asset-system/src');

const extendBabelInclude = (webpackConfig) => {
  const oneOfRule = webpackConfig.module.rules.find((rule) => Array.isArray(rule.oneOf));
  if (!oneOfRule) return;

  oneOfRule.oneOf.forEach((rule) => {
    if (!rule.loader || !rule.loader.includes('babel-loader')) return;
    if (Array.isArray(rule.include)) {
      rule.include.push(maoyangSrc);
      return;
    }
    if (rule.include) {
      rule.include = [rule.include, maoyangSrc];
      return;
    }
    rule.include = [path.resolve(__dirname, 'src'), maoyangSrc];
  });
};

module.exports = {
  webpack: {
    alias: aliasConfig.resolve.alias,
    configure: (webpackConfig) => {
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ModuleScopePlugin',
      );
      extendBabelInclude(webpackConfig);

      const definePlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'DefinePlugin',
      );
      Object.assign(definePlugin.definitions['process.env'], {
        DEFAULT_VERSION: `"${process.env.npm_package_version}"`,
      });
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: nestedModulesPlugin,
    },
  ],
};
