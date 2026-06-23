import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/components';
const HOOKS = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useReducer', 'useContext'];

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

for (const file of walk(ROOT)) {
  let code = readFileSync(file, 'utf8');
  const original = code;
  code = code.replace(/^const \{[^}]+\} = React;?\n/gm, '');
  for (const hook of HOOKS) {
    code = code.replace(new RegExp(`(?<!React\\.)\\b${hook}\\(`, 'g'), `React.${hook}(`);
  }
  if (code !== original) {
    writeFileSync(file, code);
    console.log(`fixed ${file}`);
  }
}
