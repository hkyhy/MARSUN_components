/**
 * 将 maoyang_data-asset-system 的 examples/meta.json + Demo 结构
 * 转换为 marsun_components 的 doc/example.json + doc/*.js 结构（参考 Test 组件）
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src/components');
const MAOYANG = join(ROOT, '../maoyang_data-asset-system/src/components');

const toScopeName = (packagePath) => {
  const name = packagePath.replace(/^@components\//, '').replace(/[/\-@]/g, '');
  return `_${name}`;
};

const toPackageName = (importPath) => {
  if (importPath.startsWith('@/components/')) {
    return `@components/${importPath.slice('@/components/'.length)}`;
  }
  return importPath;
};

const kebabCase = (str) =>
  str
    .replace(/Demo$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const convertApiDoc = (apiDoc) => {
  if (!apiDoc?.length) {
    return '|属性名|说明|类型|默认值|\n|  ---  | ---  | --- | --- |\n';
  }
  return apiDoc
    .map(({ componentName, rows }) => {
      const header = `#### ${componentName}\n\n|属性名|说明|类型|默认值|\n|  ---  | ---  | --- | --- |`;
      const body = (rows || [])
        .map(({ prop, desc, type, defaultVal, required }) => {
          const typeCol = required ? `${type} (必填)` : type || '';
          return `| ${prop} | ${desc || ''} | ${typeCol} | ${defaultVal ?? ''} |`;
        })
        .join('\n');
      return `${header}\n${body}`;
    })
    .join('\n\n');
};

const stripTs = (code) =>
  code
    .replace(/^import type .+$/gm, '')
    .replace(/^import React(?:, \{[^}]*\})? from 'react';?\n?/m, '')
    .replace(/^import React from 'react';?\n?/m, '')
    .replace(/^const \{[^}]+\} = React;?\n?/gm, '')
    .replace(/\buseState\(/g, 'React.useState(')
    .replace(/\buseEffect\(/g, 'React.useEffect(')
    .replace(/\buseMemo\(/g, 'React.useMemo(')
    .replace(/\buseCallback\(/g, 'React.useCallback(')
    .replace(/\buseRef\(/g, 'React.useRef(')
    .replace(/:\s*React\.FC(?:<[^>]*>)?\s*=/g, ' =')
    .replace(/:\s*React\.ReactNode/g, '')
    .replace(/:\s*React\.CSSProperties/g, '')
    .replace(/:\s*ColumnsType<[^>]+>/g, '')
    .replace(/:\s*Record(?=\s*[=])/g, '')
    .replace(/^(const|let|var)\s+(\w+)\s*:\s*[A-Z][A-Za-z0-9_$]*(\[\])?\s*=/gm, '$1 $2 =')
    .replace(/(\w+)\?:/g, '$1:')
    .replace(/as const/g, '')
    .replace(/as string \| undefined/g, '')
    .replace(/as string/g, '')
    .replace(/\s+\|\s+undefined/g, '');

const convertDemoToJs = (demoPath, modulePackageName, scopeMap) => {
  let code = readFileSync(demoPath, 'utf-8');

  // styles → plain class names
  code = code.replace(/import styles from '\.\/style\.module\.scss';?\n?/g, '');
  code = code.replace(/import classNames from 'classnames';?\n?/g, '');
  code = code.replace(/classNames\(([^,]+),\s*styles\[([^\]]+)\]\)/g, '$1');
  code = code.replace(/styles\[['"]([^'"]+)['"]\]/g, "'$1'");

  // @/components imports → scope destructuring
  const importRegex = /^import\s+(?:(\{[^}]+\})|(\w+))\s+from\s+'(@\/components\/[^']+)';?\n?/gm;
  let match;
  const scopeEntries = new Map(scopeMap);
  while ((match = importRegex.exec(code)) !== null) {
    const [, namedImports, defaultImport, importPath] = match;
    const packageName = toPackageName(importPath);
    if (!scopeEntries.has(packageName)) {
      scopeEntries.set(packageName, toScopeName(packageName));
    }
    const scopeVar = scopeEntries.get(packageName);
    if (namedImports) {
      code = code.replace(match[0], `const ${namedImports} = ${scopeVar};\n`);
    } else if (defaultImport) {
      code = code.replace(match[0], `const { default: ${defaultImport} } = ${scopeVar};\n`);
    }
  }

  // mock import → inline require path
  code = code.replace(/from '\.\/mock'/g, "from './mock.js'");

  code = stripTs(code);
  code = code.replace(/^export default (\w+);?\s*$/m, 'render(<$1 />);');

  if (!code.includes('render(')) {
    const componentMatch = code.match(/const (\w+)\s*=\s*\(\)\s*=>/);
    if (componentMatch) {
      code += `\nrender(<${componentMatch[1]} />);\n`;
      code = code.replace(/^export default \w+;?\n?/m, '');
    }
  }

  return { code: code.trim() + '\n', scopeEntries };
};

const collectDemoFiles = (examplesDir) => {
  const demos = [];
  if (!existsSync(examplesDir)) return demos;

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        const indexTsx = join(full, 'index.tsx');
        if (existsSync(indexTsx)) {
          demos.push({ name: entry, path: indexTsx, dir: full });
        } else {
          walk(full);
        }
      } else if (/Demo\.tsx$/.test(entry)) {
        demos.push({ name: basename(entry, '.tsx'), path: full, dir: examplesDir });
      }
    }
  };
  walk(examplesDir);
  return demos;
};

const findMetaFiles = (baseDir) => {
  const results = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === 'examples') {
          const meta = join(full, 'meta.json');
          if (existsSync(meta)) results.push(meta);
        } else {
          walk(full);
        }
      }
    }
  };
  walk(baseDir);
  return results;
};

const ensureIndexJs = (moduleDir) => {
  const indexJs = join(moduleDir, 'index.js');
  if (existsSync(indexJs)) return;

  const candidates = ['index.ts', 'index.tsx'].map((f) => join(moduleDir, f));
  const src = candidates.find(existsSync);
  if (!src) {
    writeFileSync(indexJs, "export {};\n");
    return;
  }
  const rel = './' + basename(src);
  writeFileSync(indexJs, `export * from '${rel}';\nexport { default } from '${rel}';\n`);
};

const processMeta = (metaPath) => {
  const examplesDir = dirname(metaPath);
  const moduleDirInMaoyang = dirname(examplesDir);
  const relFromMaoyangComponents = relative(MAOYANG, moduleDirInMaoyang);
  const moduleDir = join(SRC, relFromMaoyangComponents);
  const relModule = relative(SRC, moduleDir);
  const modulePackageName = `@components/${relModule.replace(/\\/g, '/')}`;
  const targetDocDir = join(moduleDir, 'doc');

  const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
  mkdirSync(targetDocDir, { recursive: true });

  writeFileSync(join(targetDocDir, 'summary.md'), meta.description || meta.title || '');
  writeFileSync(join(targetDocDir, 'api.md'), convertApiDoc(meta.apiDoc));

  const globalScope = new Map([[modulePackageName, toScopeName(modulePackageName)]]);
  const exampleList = [];
  const styleChunks = [];

  for (const ex of meta.examples || []) {
    const componentPath = ex.component.replace(/^@\//, '').replace(/^components\//, '');
    const demoRel = componentPath.replace(/^components\//, '');
    let demoPath = join(MAOYANG, demoRel.replace(/^components\//, ''), 'index.tsx');

    if (!existsSync(demoPath)) {
      demoPath = join(MAOYANG, demoRel + '.tsx');
    }
    if (!existsSync(demoPath)) {
      demoPath = join(examplesDir, basename(demoRel) + '.tsx');
    }
    if (!existsSync(demoPath)) {
      console.warn(`  ⚠ Demo not found: ${ex.component}`);
      continue;
    }

    const demoDirName = basename(dirname(demoPath));
    const fileName =
      demoDirName === 'examples' || demoDirName === 'index.tsx'
        ? kebabCase(basename(demoPath, '.tsx')) + '.js'
        : kebabCase(demoDirName) + '.js';
    const { code, scopeEntries } = convertDemoToJs(demoPath, modulePackageName, globalScope);
    scopeEntries.forEach((v, k) => globalScope.set(k, v));
    writeFileSync(join(targetDocDir, fileName), code);

    const demoStyle = join(dirname(demoPath), 'style.module.scss');
    if (existsSync(demoStyle)) {
      const scss = readFileSync(demoStyle, 'utf-8').replace(/@use[^;]+;/g, '');
      if (scss.trim()) styleChunks.push(scss);
    }

    exampleList.push({
      title: ex.title,
      description: ex.description,
      code: `./${fileName}`,
      scope: [
        ...[...scopeEntries.entries()].map(([packageName, name]) => ({
          name,
          packageName,
        })),
        { name: '_antd', packageName: 'antd' },
      ],
    });
  }

  // copy mock if exists
  const mockTs = join(examplesDir, 'mock.ts');
  if (existsSync(mockTs)) {
    const mockJs = readFileSync(mockTs, 'utf-8').replace(/^import type .+$/gm, '');
    writeFileSync(join(targetDocDir, 'mock.js'), mockJs);
  }

  writeFileSync(
    join(targetDocDir, 'example.json'),
    JSON.stringify({ isFull: false, list: exampleList }, null, 2) + '\n',
  );
  writeFileSync(join(targetDocDir, 'style.scss'), styleChunks.join('\n\n'));
  ensureIndexJs(moduleDir);

  console.log(`✅ ${relModule} (${exampleList.length} examples)`);
};

console.log('🔄 Converting examples/meta.json → doc/example.json ...\n');
for (const domain of ['Common', 'AgentHub']) {
  const domainDir = join(MAOYANG, domain);
  if (!existsSync(domainDir)) continue;
  for (const metaPath of findMetaFiles(domainDir)) {
    processMeta(metaPath);
  }
}
console.log('\n✨ Done');
