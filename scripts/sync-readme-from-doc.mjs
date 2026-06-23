/**
 * 从 doc/example.json + doc/*.js 重新生成各模块 README.md，
 * 供 readme-loader 在开发/构建时解析示例代码。
 */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { stringify } = require('@kne/md-doc');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const { getNestedModuleList } = require(join(ROOT, 'webstorm.webpack.config'));

const modules = await getNestedModuleList(join(ROOT, 'src/components'));

for (const { name, baseDir } of modules) {
  const exampleJson = join(baseDir, 'doc/example.json');
  if (!existsSync(exampleJson)) {
    console.warn(`skip ${name}: no doc/example.json`);
    continue;
  }
  await stringify({ baseDir, name, output: true });
  console.log(`synced README: ${name}`);
}

console.log(`\nDone (${modules.length} modules)`);
