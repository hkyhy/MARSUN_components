const { DepartmentSelect, UploaderSelect } = _Common;

const FormSelectsDemo = () => {
  const [dept, setDept] = React.useState();
  const [uploader, setUploader] = React.useState();

  return (
    <div className={'department-select-demo-header'}>
      <div>
        <label className={'department-select-demo-body'}>部门选择</label>
        <DepartmentSelect
          value={dept}
          onChange={(v) => setDept(v )}
          style={{ width: 240 }}
        />
      </div>
      <div>
        <label className={'department-select-demo-body'}>上传者选择</label>
        <UploaderSelect
          value={uploader}
          onChange={(v) => setUploader(v )}
          style={{ width: 240 }}
        />
      </div>
    </div>
  );
};

render(<FormSelectsDemo />);
