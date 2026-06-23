/** Ensure path has leading/trailing slash as requested. */
export default function ensureSlash(path, trailing = false) {
  if (!path) return trailing ? '/' : '';
  let result = path.startsWith('/') ? path : `/${path}`;
  if (trailing && !result.endsWith('/')) {
    result += '/';
  }
  return result;
}
