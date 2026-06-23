# MARSUN Components

Marsun 业务组件库，基于 React 18、Ant Design 5 与 [@kne/modules-dev](https://www.npmjs.com/package/@kne/modules-dev) 搭建。本地开发时提供组件文档站与示例预览，构建后可发布为 npm 包供业务项目引用。

## 组件域

| 目录 | 说明 |
| --- | --- |
| `Common` | 通用 UI：Form、Filter、Modal、Tag、Upload 等 |
| `AgentHub` | 智能体中心：Chat、KnowledgeBase |
| `Dashboard` / `Files` / `Review` / `Feedback` 等 | 业务页面级组件 |
| `Login` / `Profile` / `system` | 登录、个人中心与系统管理 |

各组件目录结构约定：`Action` / `Form` / `List` / `Modal` / `doc`（示例与 API 文档）/ `README.md`。

## 快速开始

```bash
npm run init    # 安装依赖（--legacy-peer-deps）
npm start       # 本地文档站，默认 http://localhost:3001
npm test        # 单元测试
npm run build   # 生产构建
```

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run create` | 通过 modules-dev 创建新组件 |
| `npm run migrate-examples` | 从 `maoyang_data-asset-system` 同步源码并迁移 examples → doc |
| `npm run generate-mocks` | 扫描组件 API 调用，生成 `doc/mock.json` |
| `npm run sync-readme` | 从 `doc/` 同步组件 README |
| `npm run fix-example-imports` | 修正示例中的 import 路径 |
| `npm run strip-example-ts` | 将示例中的 TS 剥离为 JS |

## 从业务项目同步

`migrate-examples` 默认读取同级目录 `../maoyang_data-asset-system/src/components`，通过 `rsync` 同步组件源码（排除 `examples`、`routes.tsx`），再将 `examples/meta.json` 转为本仓库的 `doc/example.json` 与 `doc/*.js` 示例。

```bash
npm run migrate-examples
npm run generate-mocks
npm run sync-readme
```

## 文档与 Mock

- 组件示例：`src/components/<域>/<模块>/doc/`
- 集中 Mock 数据：`src/docs/mocks/json/`
- 本地代理：`src/setupProxy.js`（示例请求走 mock，无需后端）

## 路径别名

| 别名 | 指向 |
| --- | --- |
| `@components/*` | `src/components/*` |
| `@common/*` | `src/common/*` |
| `@utils/*` | `src/common/utils/*` |

## 仓库

https://github.com/hkyhy/MARSUN_components
