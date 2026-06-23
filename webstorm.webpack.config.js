'use strict';
const path = require('path');
const fs = require('fs-extra');

const hostSrc = path.resolve(__dirname, './src/host');
const componentsDir = path.resolve(__dirname, './src/components');
const systemDir = path.resolve(__dirname, './src/components/system');

const hostAliasDirs = ['api', 'constants', 'hooks', 'icons', 'stores', 'styles', 'types', 'utils'];

const webpackAliases = {
  '@/components/System': systemDir,
  '@/components': componentsDir,
  '@root': path.resolve('./src'),
  '@components': componentsDir,
  ...Object.fromEntries(hostAliasDirs.map((dir) => [`@/${dir}`, path.join(hostSrc, dir)])),
  '@kne/example-driver': path.resolve(
    __dirname,
    'node_modules/@kne/modules-dev/node_modules/@kne/example-driver',
  ),
};

const getNestedModuleList = async (moduleBaseDir) => {
  const output = [];
  const walk = async (dir, prefix = '') => {
    const entries = await fs.readdir(dir);
    for (const name of entries) {
      const full = path.join(dir, name);
      if (!(await fs.stat(full)).isDirectory()) continue;
      const docDir = path.join(full, 'doc');
      const hasEntry = ['index.js', 'index.ts', 'index.tsx'].some((f) =>
        fs.existsSync(path.join(full, f)),
      );
      if ((await fs.exists(docDir)) && hasEntry) {
        const rel = prefix ? `${prefix}/${name}` : name;
        output.push({ name: rel.replace(/\//g, '/'), baseDir: full });
      }
      await walk(full, prefix ? `${prefix}/${name}` : name);
    }
  };
  await walk(moduleBaseDir);
  return output;
};

module.exports = {
  context: path.resolve(__dirname),
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: webpackAliases,
  },
  webpackAliases,
  getNestedModuleList,
};
