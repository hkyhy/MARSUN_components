const path = require('path');
const remotePlugin = require('@kne/modules-dev/lib/craco-remote-components-plugin');
const env = require('@kne/modules-dev/lib/env');
const { getNestedModuleList } = require('../webstorm.webpack.config');
const NestedReadmeWebpackPlugin = require('./readme-webpack-plugin-nested');

const patchReadmePlugin = (webpackConfig) => {
  const readmePluginIndex = webpackConfig.plugins.findIndex(
    (p) => p.constructor.name === 'ReadmeWebpackPlugin',
  );
  if (readmePluginIndex < 0) {
    return webpackConfig;
  }

  const { options } = webpackConfig.plugins[readmePluginIndex];
  webpackConfig.plugins[readmePluginIndex] = new NestedReadmeWebpackPlugin({
    ...options,
    getModuleList: getNestedModuleList,
  });
  return webpackConfig;
};

/** 扩展 CracoRemoteComponentsPlugin，支持 Common/Form 等嵌套子模块的 doc 扫描 */
module.exports = {
  overrideCracoConfig: ({ cracoConfig, pluginOptions }) => {
    cracoConfig = remotePlugin.overrideCracoConfig({ cracoConfig, pluginOptions });

    // 扩展 doc 目录监听范围到嵌套子模块
    const readmeCracoPlugin = cracoConfig.plugins.find(
      (item) => item.plugin === require('@kne/modules-dev/lib/craco-readme-plugin'),
    );
    if (readmeCracoPlugin) {
      readmeCracoPlugin.options = {
        ...readmeCracoPlugin.options,
        watchTarget: path.resolve(env.moduleBaseDir, '**/doc/**/*'),
        watchCallback: ({ dir }) => {
          const rel = path.relative(env.moduleBaseDir, dir);
          const parts = rel.split(path.sep);
          parts.pop();
          const name = parts.join('/');
          if (!name) {
            return {};
          }
          return {
            name,
            baseDir: path.resolve(env.moduleBaseDir, name),
          };
        },
      };
    }

    // 须在 ReadmeWebpackPlugin 注册之后再替换
    cracoConfig.plugins.push({
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => patchReadmePlugin(webpackConfig),
      },
    });

    return cracoConfig;
  },
  overrideWebpackConfig({ webpackConfig, context, pluginOptions }) {
    return remotePlugin.overrideWebpackConfig({ webpackConfig, context, pluginOptions });
  },
};
