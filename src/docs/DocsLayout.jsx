import { ConfigProvider, Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

const DocsLayout = ({ paths = [], theme, children }) => {
  const location = useLocation();
  const selectedKey =
    paths.find((item) => location.pathname.startsWith(item.path))?.key ?? paths[0]?.key;

  return (
    <ConfigProvider theme={theme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            background: '#001529',
            padding: '0 24px',
          }}
        >
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            Marsun Components
          </Typography.Title>
          {paths.length > 0 && (
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={selectedKey ? [selectedKey] : []}
              items={paths.map(({ key, path, title }) => ({
                key,
                label: <Link to={path}>{title}</Link>,
              }))}
              style={{ flex: 1, minWidth: 0, background: 'transparent' }}
            />
          )}
        </Header>
        <Content>{children ?? <Outlet />}</Content>
      </Layout>
    </ConfigProvider>
  );
};

export default DocsLayout;
