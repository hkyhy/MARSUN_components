import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/components';

const walk = (dir, files = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (/\/doc\/.*\.js$/.test(full)) {
      files.push(full);
    }
  }
  return files;
};

const stripExampleTs = (code) => {
  let result = code;
  result = result.replace(/^import type .+$/gm, '');
  result = result.replace(/:\s*ColumnsType<[^>]+>/g, '');
  result = result.replace(/:\s*Record(?=\s*[=])/g, '');
  result = result.replace(/^(const|let|var)\s+(\w+)\s*:\s*[A-Z][A-Za-z0-9_$]*(\[\])?\s*=/gm, '$1 $2 =');
  result = result.replace(/(\w+)\?:/g, '$1:');
  return result;
};

for (const file of walk(ROOT)) {
  const original = readFileSync(file, 'utf8');
  const next = stripExampleTs(original);
  if (next !== original) {
    writeFileSync(file, next);
    console.log(`stripped ${file}`);
  }
}
