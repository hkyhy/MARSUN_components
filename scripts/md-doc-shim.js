const crypto = require('node:crypto');
const path = require('path');
const { unescape } = require('html-escaper');

const mixinLoadPaths = [
  path.resolve(__dirname, '../../maoyang_data-asset-system/src/styles'),
];

const mdDocPath = require.resolve('@kne/md-doc');

const patchMdDocStyleTransform = () => {
  const fs = require('fs');
  const marker = '/* marsun-mixin-load-paths */';
  let code = fs.readFileSync(mdDocPath, 'utf8');
  if (code.includes(marker)) {
    return;
  }

  const loadPathsLiteral = JSON.stringify(mixinLoadPaths);
  code = code.replace(
    'const result = sass.compileString(`.${styleId}{${unescape(styleString)}}`);',
    `${marker}
    const _raw = unescape(styleString).trim();
    const _needsMixins = /@include\\s+\\w+/.test(_raw) && !/@use\\s+['"]mixins['"]/.test(_raw);
    const _scss = _needsMixins ? \`@use 'mixins' as *;\\n.\${styleId}{\${_raw}}\` : \`.\${styleId}{\${_raw}}\`;
    const result = sass.compileString(_scss, _needsMixins ? { loadPaths: ${loadPathsLiteral} } : undefined);`,
  );
  fs.writeFileSync(mdDocPath, code);
  delete require.cache[mdDocPath];
};

patchMdDocStyleTransform();
const mdDoc = require(mdDocPath);

const generateStyleId = (name) =>
  name.replace(/[@\/\-]/g, '_') + '_' + crypto.createHash('md5').update(name).digest('hex').slice(0, 5);

const buildScssSource = (styleId, styleString) => {
  const raw = unescape(styleString).trim();
  if (!raw) {
    return `.${styleId}{}`;
  }

  const hasMixinsUse =
    /@use\s+['"]mixins['"]/.test(raw) || /@use\s+['"]@\/styles\/mixins['"]/.test(raw);
  const needsMixins = /@include\s+\w+/.test(raw) && !hasMixinsUse;

  if (needsMixins) {
    return `@use 'mixins' as *;\n.${styleId}{${raw}}`;
  }

  return `.${styleId}{${raw}}`;
};

const styleTransform = (name, styleString) => {
  const output = { className: '', style: '' };

  if (!styleString || typeof styleString !== 'string') {
    return output;
  }

  const styleId = generateStyleId(name);
  output.className = styleId;

  let sass;
  try {
    sass = require('sass');
  } catch {
    return output;
  }

  try {
    const result = sass.compileString(buildScssSource(styleId, styleString), {
      loadPaths: mixinLoadPaths,
    });
    output.style = result.css;
  } catch (error) {
    console.warn('样式编译失败:', error.message);
  }

  return output;
};

const parse = (text) => mdDoc.parse(text);

const stringify = async (options = {}) => mdDoc.stringify(options);

module.exports = {
  parse,
  stringify,
  styleTransform,
};
