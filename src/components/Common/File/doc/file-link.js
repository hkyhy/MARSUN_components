const { FileLink } = _Common;
import { message } from 'antd';
import { mockFileItems } from '../mock';

const FileLinkDemo = () => {
  return (
    <div className={'file-link-demo-preview'}>
      <h4 className={'file-link-demo-scroll'}>文件链接列表</h4>
      <div className={'file-link-demo-thumb'}>
        {mockFileItems.map((file) => (
          <FileLink
            key={file.id}
            file={file}
            onClick={(f) => message.info(`点击文件: ${f.name}`)}
          />
        ))}
      </div>

      <h4 className={'file-link-demo-viewport'}>内联展示</h4>
      <div className={'file-link-demo-track'}>
        附件：
        {mockFileItems.slice(0, 3).map((file) => (
          <FileLink key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};

render(<FileLinkDemo />);
