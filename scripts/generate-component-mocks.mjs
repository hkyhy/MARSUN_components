/**
 * 为涉及接口的组件模块生成 doc/mock.json。
 * 从组件源码识别 Api 调用，并从 src/docs/mocks/json/ 填充响应体。
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const COMPONENTS = join(ROOT, 'src/components');
const CENTRAL_MOCKS = join(ROOT, 'src/docs/mocks/json');

/** Api 方法 → HTTP 端点（与 setupProxy exactRoutes 对齐） */
const API_METHOD_ENDPOINTS = {
  'deptApi.tree': 'GET /departments/tree',
  'deptApi.list': 'GET /departments',
  'deptApi.publicTree': 'GET /departments/public-tree',
  'userApi.uploaders': 'GET /users/uploaders',
  'userApi.list': 'GET /users',
  'fileApi.list': 'GET /files',
  'fileApi.get': 'GET /files/:id',
  'fileApi.folders': 'GET /files/folders',
  'statsApi.overview': 'GET /statistics/overview',
  'statsApi.departments': 'GET /statistics/departments',
  'statsApi.pointsDepartments': 'GET /statistics/points/departments',
  'permissionApi.reviewers': 'GET /permissions/reviewers',
  'settingsApi.getMaxFileSize': 'GET /settings/max-file-size',
  'agentHubApi.listDatasets': 'GET /agent-hub/datasets',
  'agentHubApi.listChats': 'GET /agent-hub/chats',
  'agentHubApi.listSessions': 'GET /agent-hub/chats/:id/sessions',
  'agentHubApi.listDocuments': 'GET /agent-hub/datasets/:id/documents',
  'reviewApi.list': 'GET /reviews',
  'reviewApi.pending': 'GET /reviews/pending',
  'feedbackApi.list': 'GET /feedbacks',
  'authApi.login': 'POST /auth/login',
};

const ENDPOINT_TO_CENTRAL_FILE = {
  'GET /departments/tree': 'departments-tree.json',
  'GET /departments': 'departments-list.json',
  'GET /departments/public-tree': 'departments-tree.json',
  'GET /users/uploaders': 'users-uploaders.json',
  'GET /users': 'users-list.json',
  'GET /files': 'files-list.json',
  'GET /statistics/overview': 'statistics-overview.json',
  'GET /agent-hub/datasets': 'agent-hub-datasets.json',
  'GET /agent-hub/chats': 'agent-hub-chats.json',
  'GET /agent-hub/chats/:id/sessions': 'agent-hub-sessions.json',
  'GET /agent-hub/datasets/:id/documents': 'agent-hub-documents.json',
  'GET /permissions/reviewers': 'permissions-reviewers.json',
  'GET /settings/max-file-size': 'settings-max-file-size.json',
  'POST /auth/login': 'auth-login.json',
  'GET /reviews': 'reviews-list.json',
  'GET /reviews/pending': 'reviews-pending.json',
  'GET /feedbacks': 'feedbacks-list.json',
};

const loadCentral = (endpoint) => {
  const file = ENDPOINT_TO_CENTRAL_FILE[endpoint];
  if (!file) return null;
  const path = join(CENTRAL_MOCKS, file);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
};

const scanApisInDir = (dir) => {
  const endpoints = new Set();
  const walk = (current) => {
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);
      if (statSync(full).isDirectory()) {
        if (['__tests__', 'doc', 'examples', 'node_modules'].includes(entry)) continue;
        walk(full);
        continue;
      }
      if (!/\.(tsx?|jsx?)$/.test(entry)) continue;
      const content = readFileSync(full, 'utf-8');
      for (const [method, endpoint] of Object.entries(API_METHOD_ENDPOINTS)) {
        const [api, fn] = method.split('.');
        const pattern = new RegExp(`${api}\\s*\\.\\s*${fn}\\b`);
        if (pattern.test(content)) endpoints.add(endpoint);
      }
      const directPaths = content.matchAll(/request\.(get|post|put|delete)\(\s*['`](\/[^'"`]+)['`]/g);
      for (const [, method, path] of directPaths) {
        endpoints.add(`${method.toUpperCase()} ${path}`);
      }
    }
  };
  walk(dir);
  return [...endpoints];
};

const walkModules = (dir, prefix = '') => {
  const modules = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    const rel = prefix ? `${prefix}/${entry}` : entry;
    const docDir = join(full, 'doc');
    if (existsSync(docDir)) modules.push({ rel, baseDir: full });
    modules.push(...walkModules(full, rel));
  }
  return modules;
};

const ensureCentralMocks = () => {
  const defaults = {
    'auth-login.json': { code: 0, message: 'ok', data: { token: 'mock-token', user: { id: 'user-1', displayName: '演示用户' } } },
    'reviews-list.json': { code: 0, message: 'ok', data: { list: [], total: 0 } },
    'reviews-pending.json': { code: 0, message: 'ok', data: { list: [], total: 0 } },
    'feedbacks-list.json': { code: 0, message: 'ok', data: { list: [], total: 0 } },
  };
  for (const [file, body] of Object.entries(defaults)) {
    const p = join(CENTRAL_MOCKS, file);
    if (!existsSync(p)) writeFileSync(p, JSON.stringify(body, null, 2) + '\n');
  }
};

ensureCentralMocks();

let count = 0;
for (const { rel, baseDir } of walkModules(COMPONENTS)) {
  const endpoints = scanApisInDir(baseDir);
  const fixturesPath = join(baseDir, 'doc', 'fixtures.json');
  let fixtures = null;
  if (existsSync(fixturesPath)) {
    fixtures = JSON.parse(readFileSync(fixturesPath, 'utf-8'));
  }

  if (endpoints.length === 0 && !fixtures) continue;

  const apis = {};
  for (const endpoint of endpoints) {
    const payload = loadCentral(endpoint);
    if (payload) apis[endpoint] = payload;
  }

  const mock = { ...(Object.keys(apis).length ? { apis } : {}), ...(fixtures ? { fixtures } : {}) };
  writeFileSync(join(baseDir, 'doc/mock.json'), JSON.stringify(mock, null, 2) + '\n');
  console.log(`mock.json: ${rel} (${endpoints.length} apis)`);
  count++;
}

console.log(`\nDone (${count} modules with mock.json)`);
