import { FILE_TYPE_TREE_DATA } from '../constants';
import ImageUploader from './ImageUploader';
import { ColorPicker, Col, Form, Input, Row, TreeSelect } from 'antd';
import React from 'react';

interface SettingsFormProps {
  form: ReturnType<typeof Form.useForm>[0];
}

/** 系统设置表单字段（纯 UI） */
const SettingsForm: React.FC<SettingsFormProps> = ({ form }) => (
  <Form form={form} layout="vertical">
    <Row gutter={24}>
      <Col span={12}>
        <Form.Item
          label="系统名称"
          name="systemName"
          rules={[{ required: true, message: '请输入系统名称' }]}
        >
          <Input placeholder="请输入系统名称" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="系统简称"
          name="systemShortName"
          rules={[{ required: true, message: '请输入系统简称' }]}
        >
          <Input placeholder="侧边栏收起时显示" />
        </Form.Item>
      </Col>
    </Row>
    <Form.Item label="页脚信息" name="footerText">
      <Input placeholder="请输入页脚信息" />
    </Form.Item>
    <Form.Item
      label="可上传文件类型"
      name="allowedFileTypes"
      rules={[{ required: true, message: '请至少选择一种文件类型' }]}
      tooltip="控制系统中允许上传的文件类型，同时也作为文件类型筛选项"
    >
      <TreeSelect
        treeCheckable
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        treeData={FILE_TYPE_TREE_DATA}
        placeholder="请选择可上传的文件类型"
        allowClear
        treeDefaultExpandAll
        style={{ width: '100%' }}
      />
    </Form.Item>
    <Row gutter={24}>
      <Col span={12}>
        <Form.Item
          label="主题色"
          name="themeColor"
          getValueFromEvent={(color) =>
            typeof color === 'string' ? color : (color?.toHexString?.() ?? color)
          }
        >
          <ColorPicker format="hex" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={24}>
      <Col span={12}>
        <Form.Item label="系统 Logo" name="logo">
          <ImageUploader label="系统 Logo" previewWidth={160} previewHeight={90} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="登录页背景图" name="loginBg">
          <ImageUploader label="登录页背景图" previewWidth={160} previewHeight={90} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

export default SettingsForm;
