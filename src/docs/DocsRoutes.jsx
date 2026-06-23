import { Result } from 'antd';
import get from 'lodash/get';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import DocsLayout from './DocsLayout';
import Example from './Example';
import ensureSlash from './ensureSlash';

const ModulesIsEmpty = ({ readme, baseUrl }) => {
  const location = useLocation();

  if (
    readme &&
    Object.keys(readme).length > 0 &&
    ensureSlash(location.pathname, true) === baseUrl
  ) {
    return <Navigate to={`${baseUrl}${Object.keys(readme)[0]}`} />;
  }

  if (readme && Object.keys(readme).length > 0) {
    return <Outlet />;
  }

  return (
    <Result
      status="404"
      title="没有检测到业务组件"
      subTitle="请检查组件 doc 目录与 MODULES_DEV_BASE_DIR 配置是否正确"
    />
  );
};

const DocsRoutes = ({
  theme,
  baseUrl = '',
  paths = [
    { key: 'index', path: '/', title: '首页' },
    { key: 'components', path: `${baseUrl}/components`, title: '组件' },
  ],
  readme,
  pageProps,
  children,
}) => {
  const componentsPath = paths.find((item) => item.key === 'components');
  const componentsBaseUrl = ensureSlash(get(componentsPath, 'path', '/'), true);
  const baseUrlPrefix = new RegExp(`^${ensureSlash(baseUrl, true)}`);
  const componentsRoutePath = ensureSlash(componentsBaseUrl.replace(baseUrlPrefix, ''));

  return (
    <Routes>
      <Route
        element={<DocsLayout paths={paths} theme={theme} />}
      >
        {componentsPath && (
          <Route
            path={componentsRoutePath}
            element={<ModulesIsEmpty baseUrl={componentsBaseUrl} readme={readme} />}
          >
            <Route
              path=":id"
              element={
                <Example
                  baseUrl={componentsBaseUrl}
                  readme={readme}
                  theme={theme}
                  pageProps={pageProps}
                />
              }
            />
            <Route
              path=":id/*"
              element={
                <Example
                  baseUrl={componentsBaseUrl}
                  readme={readme}
                  theme={theme}
                  pageProps={pageProps}
                />
              }
            />
          </Route>
        )}
      </Route>
      <Route path="*" element={children} />
    </Routes>
  );
};

export default DocsRoutes;
