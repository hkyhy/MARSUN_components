const path = require('path');
const nestedModulesPlugin = require('./scripts/craco-nested-modules-plugin');
const aliasConfig = require('./webstorm.webpack.config');

process.env.CI = false;

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        ...aliasConfig.webpackAliases,
        '@kne/md-doc': path.resolve(__dirname, 'scripts/md-doc-shim.js'),
      };
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ModuleScopePlugin',
      );

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
