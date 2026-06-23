import { Layout, Menu, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import ExampleContent from './ExampleContent';
import styles from './docs.module.scss';

const { Sider, Content } = Layout;

const ExamplePage = ({ data, current, items, theme, pageProps = {}, menuProps = {} }) => {
  const navigate = useNavigate();

  return (
    <Layout className={styles.examplePage} {...pageProps}>
      {items?.length > 0 && (
        <Sider width={220} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
          <Menu
            mode="inline"
            selectedKeys={[current]}
            items={items.map(({ label, key }) => ({ key, label }))}
            onClick={({ key }) => {
              const item = items.find((entry) => entry.key === key);
              if (item?.path) {
                navigate(item.path);
              }
            }}
            {...menuProps}
          />
        </Sider>
      )}
      <Layout>
        <Content style={{ padding: '24px 32px', background: '#fff' }}>
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            {data.name}
          </Typography.Title>
          <ExampleContent data={data} theme={theme} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ExamplePage;
