const crypto = require('node:crypto');
const fs = require('fs-extra');
const path = require('path');
const { unescape } = require('html-escaper');

const mixinLoadPaths = [path.resolve(__dirname, '../src/host/styles')];

const mdDoc = require('@kne/md-doc');

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

const extractExampleStyle = (text) => {
  const match = text.match(/####\s*示例样式[\s\S]*?```scss\n([\s\S]*?)```/);
  return match ? match[1] : '';
};

const parse = (text) => {
  const data = mdDoc.parse(text);
  const styleString = extractExampleStyle(text);

  if (!styleString.trim() || !/@include\s+\w+/.test(styleString)) {
    return data;
  }

  const styleObject = styleTransform(data.name, styleString);
  data.example = data.example || {};
  data.example.className = styleObject.className;
  data.example.style = styleObject.style;

  return data;
};

const stringify = async (options = {}) => {
  const result = await mdDoc.stringify(options);
  const stylePath = path.resolve(options.baseDir || process.cwd(), './doc/style.scss');

  if (!(await fs.pathExists(stylePath))) {
    return result;
  }

  const styleString = await fs.readFile(stylePath, 'utf8');
  if (!/@include\s+\w+/.test(styleString)) {
    return result;
  }

  const name = result.data?.name || path.basename(options.baseDir || '');
  const styleObject = styleTransform(name, styleString);

  if (result.data?.example) {
    result.data.example.className = styleObject.className;
    result.data.example.style = styleObject.style;
  }

  return result;
};

module.exports = {
  parse,
  stringify,
  styleTransform,
};
