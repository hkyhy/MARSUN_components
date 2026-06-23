import ExampleDriver from '@kne/example-driver';
import '@kne/example-driver/dist/index.css';
import { ConfigProvider, Space } from 'antd';
import classnames from 'classnames';
import get from 'lodash/get';
import { useEffect, useMemo } from 'react';
import Highlight from './Highlight';
import styles from './docs.module.scss';

const ExampleContent = ({ data, theme }) => {
  const exampleStyle = get(data, 'example.style');

  const DriverContext = useMemo(
    () =>
      function ExampleContext({ children }) {
        return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
      },
    [theme],
  );

  useEffect(() => {
    if (!exampleStyle) {
      return undefined;
    }
    const dom = document.createElement('style');
    dom.innerText = exampleStyle.replace(/\n/g, '');
    document.head.append(dom);
    return () => {
      document.head.removeChild(dom);
    };
  }, [exampleStyle]);

  return (
    <Space className={classnames('container', styles.main)} direction="vertical">
      {data.packageName && (
        <>
          <h2 className={styles.partTitle}>安装</h2>
          <Highlight
            className="mark-down-html"
            html={`<pre><code class="language-shell hljs">npm install --save ${data.packageName}</code></pre>`}
          />
        </>
      )}
      {data.description && (
        <>
          <h2 className={styles.partTitle}>描述</h2>
          <Highlight className="mark-down-html" html={data.description} />
        </>
      )}
      {data.summary && (
        <>
          <h2 className={styles.partTitle}>概述</h2>
          <Highlight className="mark-down-html" html={data.summary} />
        </>
      )}
      {data.example?.list?.length > 0 && (
        <>
          <h2 className={styles.partTitle}>代码示例</h2>
          <div className={classnames(styles.example, data.example.className)}>
            <ExampleDriver
              contextComponent={DriverContext}
              isFull={data.example.isFull}
              list={data.example.list}
            />
          </div>
        </>
      )}
      {data.api && (
        <>
          <h2 className={styles.partTitle}>API</h2>
          <Highlight className="mark-down-html" html={data.api} />
        </>
      )}
    </Space>
  );
};

export default ExampleContent;
