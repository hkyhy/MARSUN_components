const { UploaderSelect } = _Common;

/** UploaderSelect 基础用法 */
const UploaderSelectDemo = () => {
  const [uploader, setUploader] = useState<string>();

  return (
    <div className={'uploader-select-demo-header'}>
      <div>
        <label className={'uploader-select-demo-col'}>上传者选择</label>
        <UploaderSelect
          value={uploader}
          onChange={(v) => setUploader(v )}
          placeholder="请选择上传者"
          style={{ width: 280 }}
        />
        <p className={'uploader-select-demo-wrap'}>当前选中：{uploader ?? '-'}</p>
      </div>
    </div>
  );
};

render(<UploaderSelectDemo />);
