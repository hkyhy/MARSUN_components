'use strict';
const path = require('path');
const fs = require('fs-extra');

const maoyangSrc = path.resolve(__dirname, '../maoyang_data-asset-system/src');
const componentsDir = path.resolve(__dirname, './src/components');

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
    alias: {
      '@root': path.resolve('./src'),
      '@components': path.resolve('./src/components'),
      '@/components/Common': path.resolve('./src/components/Common'),
      '@/components/AgentHub': path.resolve('./src/components/AgentHub'),
      '@': maoyangSrc,
      '@kne/example-driver': path.resolve(
        __dirname,
        'node_modules/@kne/modules-dev/node_modules/@kne/example-driver',
      ),
    },
  },
  getNestedModuleList,
};
