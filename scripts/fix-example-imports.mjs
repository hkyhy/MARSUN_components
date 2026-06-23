import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve('src/components');

const prepareMock = (content) =>
  content
    .replace(/^import .+$/gm, '')
    .replace(/export const /g, 'const ')
    .replace(/ReviewStatus\.(\w+)/g, "'$1'")
    .replace(/UserRole\.(\w+)/g, "'$1'");

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

const resolveMockPath = (file, spec) => {
  const base = dirname(file);
  const candidates = [];
  if (spec === '../mock' || spec === '../mock.js') {
    candidates.push(join(base, 'mock.js'));
    candidates.push(join(base, '..', 'mock.js'));
  }
  if (spec.startsWith('./')) {
    candidates.push(join(base, spec));
    candidates.push(join(base, `${spec}.js`));
  }
  return candidates.find((path) => existsSync(path)) ?? null;
};

const inlineMockImports = (file) => {
  let code = readFileSync(file, 'utf8');
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?\n?/g;
  let match;
  const mocks = [];
  while ((match = importRegex.exec(code)) !== null) {
    const [, , spec] = match;
    if (!spec.includes('mock')) continue;
    const mockPath = resolveMockPath(file, spec);
    if (!mockPath) continue;
    mocks.push({ full: match[0], path: mockPath });
  }
  if (mocks.length === 0) return false;

  const uniquePaths = [...new Set(mocks.map((item) => item.path))];
  const mockBlocks = uniquePaths.map((path) => prepareMock(readFileSync(path, 'utf8')).trim());
  for (const { full } of mocks) {
    code = code.replace(full, '');
  }
  writeFileSync(file, `${mockBlocks.join('\n\n')}\n\n${code.trim()}\n`);
  console.log(`inlined mock -> ${file}`);
  return true;
};

for (const file of walk(ROOT)) {
  inlineMockImports(file);
}

// Fix copyable shorthand broken by strip-ts (text: CODE -> text)
for (const file of walk(ROOT)) {
  let code = readFileSync(file, 'utf8');
  const original = code;
  code = code.replace(
    /copyable=\{\{\s*text,\s*tooltips/g,
    (match, offset) => {
      const before = code.slice(0, offset);
      const codes = [...before.matchAll(/const ([A-Z][A-Z0-9_]+) = `/g)].map((m) => m[1]);
      const codeName = codes[codes.length - 1];
      return codeName ? `copyable={{ text: ${codeName}, tooltips` : match;
    },
  );
  if (code !== original) {
    writeFileSync(file, code);
    console.log(`fixed copyable -> ${file}`);
  }
}
