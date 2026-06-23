const fs = require('fs');
const path = require('path');

const MOCKS_DIR = path.join(__dirname, 'docs/mocks/json');
const COMPONENTS_DIR = path.join(__dirname, 'components');

/** 1x1 透明 PNG，用于文件预览占位 */
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

const loadJson = (name) => JSON.parse(fs.readFileSync(path.join(MOCKS_DIR, name), 'utf8'));

/** 精确匹配：method + path（不含 /api 前缀）→ 中央 mock 文件 */
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
  'POST /auth/login': 'auth-login.json',
  'GET /reviews': 'reviews-list.json',
  'GET /reviews/pending': 'reviews-pending.json',
  'GET /feedbacks': 'feedbacks-list.json',
};

/** 从各组件 doc/mock.json 合并端点响应（启动时加载一次） */
const componentApiMocks = (() => {
  const merged = {};
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        if (entry === 'doc') {
          const mockPath = path.join(full, 'mock.json');
          if (fs.existsSync(mockPath)) {
            try {
              const { apis } = JSON.parse(fs.readFileSync(mockPath, 'utf8'));
              if (apis) Object.assign(merged, apis);
            } catch (e) {
              console.warn('[setupProxy] invalid mock.json:', mockPath, e.message);
            }
          }
        } else {
          walk(full);
        }
      }
    }
  };
  walk(COMPONENTS_DIR);
  return merged;
})();

const matchRoute = (method, urlPath) => {
  const key = `${method} ${urlPath}`;

  if (componentApiMocks[key]) {
    return componentApiMocks[key];
  }

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
 * @see src/docs/mocks/json/ 中央 mock
 * @see src/components/**/doc/mock.json 组件级 mock
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
