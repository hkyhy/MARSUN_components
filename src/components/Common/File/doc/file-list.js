const { FileList, ReviewStatusTag } = _Common;
import { message } from 'antd';
import { mockFileItems } from '../mock';

const FileListDemo = () => {
  return (
    <div className={'file-list-demo-banner'}>
      <h4 className={'file-list-demo-scroll'}>默认模式（FileItem）</h4>
      <FileList
        items={mockFileItems.slice(0, 3).map((file) => ({
          file,
          status: <ReviewStatusTag status={file.reviewStatus} />,
        }))}
        onDelete={(f) => message.info(`删除: ${f.name}`)}
        showDelete
      />

      <h4 className={'file-list-demo-viewport'}>链接模式（FileLink）</h4>
      <FileList
        items={mockFileItems.map((file) => ({ file, type: 'link'  }))}
        onLinkClick={(f) => message.info(`点击: ${f.name}`)}
      />

      <h4 className={'file-list-demo-viewport'}>混合模式</h4>
      <FileList
        items={[
          ...mockFileItems.slice(0, 2).map((file) => ({
            file,
            type: 'default' ,
            status: <ReviewStatusTag status={file.reviewStatus} />,
          })),
          ...mockFileItems.slice(2, 4).map((file) => ({
            file,
            type: 'link' ,
          })),
        ]}
      />
    </div>
  );
};

render(<FileListDemo />);
