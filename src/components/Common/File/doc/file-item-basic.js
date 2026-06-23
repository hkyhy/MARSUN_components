const { FileItemView, ReviewStatusTag } = _Common;
import { message } from 'antd';
import { mockFileItems } from '../mock';

const customActions = [
  {
    key: 'share',
    icon: <span className={'file-item-basic-demo-value'}>📤</span>,
    tooltip: '分享',
    onClick: (file) => message.info(`分享: ${file.name}`),
  },
];

const FileItemBasicDemo = () => {
  return (
    <div className={'file-item-basic-demo-preview'}>
      <h4 className={'file-item-basic-demo-scroll'}>基础用法（图标 + 文件名 + 操作）</h4>
      {mockFileItems.slice(0, 3).map((file) => (
        <FileItemView key={file.id} file={file} />
      ))}

      <h4 className={'file-item-basic-demo-viewport'}>带状态标签</h4>
      {mockFileItems.slice(0, 3).map((file) => (
        <FileItemView
          key={file.id}
          file={file}
          status={<ReviewStatusTag status={file.reviewStatus} />}
        />
      ))}

      <h4 className={'file-item-basic-demo-viewport'}>带删除和自定义操作</h4>
      {mockFileItems.slice(0, 2).map((file) => (
        <FileItemView
          key={file.id}
          file={file}
          showDelete
          actions={customActions}
          onDelete={(f) => message.info(`删除: ${f.name}`)}
        />
      ))}
    </div>
  );
};

render(<FileItemBasicDemo />);
