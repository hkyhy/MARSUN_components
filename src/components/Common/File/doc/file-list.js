const mockFileItems = [
  {
    id: '1',
    name: '项目需求文档.docx',
    type: 'FILE',
    size: 1024000,
    extension: '.docx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: '数据分析报表.xlsx',
    type: 'FILE',
    size: 512000,
    extension: '.xlsx',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'PENDING_REVIEWER',
    version: 2,
    createdAt: '2026-02-20T14:00:00Z',
    updatedAt: '2026-03-01T09:15:00Z',
  },
  {
    id: '3',
    name: '产品演示.pptx',
    type: 'FILE',
    size: 5120000,
    extension: '.pptx',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-10T16:45:00Z',
    updatedAt: '2026-03-10T16:45:00Z',
  },
  {
    id: '4',
    name: '系统架构图.png',
    type: 'FILE',
    size: 2048000,
    extension: '.png',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user1',
    uploaderName: '张三',
    reviewStatus: 'APPROVED',
    version: 1,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: '5',
    name: '接口文档.pdf',
    type: 'FILE',
    size: 3072000,
    extension: '.pdf',
    parentId: null,
    departmentId: 'dept1',
    departmentName: '技术部',
    uploaderId: 'user2',
    uploaderName: '李四',
    reviewStatus: 'REVIEWING_REVIEWER',
    version: 3,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-03-05T17:30:00Z',
  },
  {
    id: '6',
    name: '产品演示.mp4',
    type: 'FILE',
    size: 8388608,
    extension: '.mp4',
    parentId: null,
    departmentId: 'dept2',
    departmentName: '产品部',
    uploaderId: 'user3',
    uploaderName: '王五',
    reviewStatus: 'DRAFT',
    version: 1,
    createdAt: '2026-03-11T16:45:00Z',
    updatedAt: '2026-03-11T16:45:00Z',
  },
];

const { FileList, ReviewStatusTag } = _Common;
const { message } = _antd;

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
