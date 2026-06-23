const fs = require('fs');
const path = require('path');

const MOCKS_DIR = path.join(__dirname, 'docs/mocks/json');

/** 1x1 透明 PNG，用于文件预览占位 */
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

const loadJson = (name) => JSON.parse(fs.readFileSync(path.join(MOCKS_DIR, name), 'utf8'));

/** 精确匹配：method + path（不含 /api 前缀） */
const exactRoutes = {
  'GET /departments/tree': 'departments-tree.json',
  'GET /departments': 'departments-list.json',
  'GET /departments/public-tree': 'departments-tree.json',
  'GET /users/uploaders': 'users-uploaders.json',
  'GET /users': 'users-list.json',
  'GET /agent-hub/datasets': 'agent-hub-datasets.json',
  'GET /agent-hub/chats': 'agent-hub-chats.json',
  'GET /files': 'files-list.json',
  'GET /statistics/overview': 'statistics-overview.json',
  'GET /permissions/reviewers': 'permissions-reviewers.json',
  'GET /settings/max-file-size': 'settings-max-file-size.json',
};

const matchRoute = (method, urlPath) => {
  const key = `${method} ${urlPath}`;
  if (exactRoutes[key]) {
    return loadJson(exactRoutes[key]);
  }

  if (method === 'GET' && /^\/agent-hub\/chats\/[^/]+\/sessions$/.test(urlPath)) {
    return loadJson('agent-hub-sessions.json');
  }

  if (method === 'GET' && /^\/agent-hub\/datasets\/[^/]+\/documents$/.test(urlPath)) {
    return loadJson('agent-hub-documents.json');
  }

  if (method === 'GET' && /^\/agent-hub\/chats\/[^/]+\/sessions\/[^/]+$/.test(urlPath)) {
    const sessions = loadJson('agent-hub-sessions.json');
    const first = sessions.data.list[0];
    return { code: 0, message: 'ok', data: first };
  }

  if (method === 'GET' && /^\/files\/[^/]+\/download$/.test(urlPath)) {
    return 'FILE_DOWNLOAD';
  }

  if (method === 'GET' && /^\/files\/[^/]+$/.test(urlPath)) {
    const files = loadJson('files-list.json');
    const id = urlPath.split('/')[2];
    const file = files.data.list.find((item) => item.id === id) ?? files.data.list[0];
    return { code: 0, message: 'ok', data: file };
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return loadJson('success.json');
  }

  return null;
};

/**
 * 文档站开发环境 API Mock（无后端时拦截 /api 请求）
 * @see src/docs/mocks/json/
 */
module.exports = function setupDocsApiMock(app) {
  app.use('/api', (req, res) => {
    const urlPath = (req.originalUrl || req.url).replace(/^\/api/, '').split('?')[0] || '/';
    const payload = matchRoute(req.method, urlPath);

    if (payload === 'FILE_DOWNLOAD') {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).send(PLACEHOLDER_PNG);
      return;
    }

    if (payload) {
      res.status(200).json(payload);
      return;
    }

    res.status(200).json({
      code: 0,
      message: 'ok (docs mock fallback)',
      data: null,
    });
  });
};
