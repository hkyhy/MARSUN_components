import type { PointConfig } from '@/types';
import { Card, Form, InputNumber, Switch } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface PointConfigFormProps {
  form: FormInstance;
}

const PointConfigForm: React.FC<PointConfigFormProps> = ({ form }) => {
  return (
    <Card title="积分规则配置" className={classNames('point-config-form-config-card', styles['point-config-form-config-card'])}>
      <Form form={form} layout="vertical">
        <div className={classNames('point-config-form-form-grid', styles['point-config-form-form-grid'])}>
          <Form.Item
            name={['base', 'pointsPerFile']}
            label="基础分（审核结案/件）"
            rules={[{ required: true, message: '请输入基础分' }]}
          >
            <InputNumber min={0} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分" />
          </Form.Item>
          <Form.Item
            name={['quality', 'high']}
            label="质量分 - 极高质量"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分" />
          </Form.Item>
          <Form.Item
            name={['quality', 'medium']}
            label="质量分 - 高质量"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分" />
          </Form.Item>
          <Form.Item name={['quality', 'low']} label="质量分 - 中等质量" rules={[{ required: true }]}>
            <InputNumber min={0} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分" />
          </Form.Item>
          <Form.Item
            name={['behavior', 'excellentCasePoints']}
            label="行为分 - 优秀案例"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分/次" />
          </Form.Item>
          <Form.Item
            name={['behavior', 'maxPerReviewerPerMonth']}
            label="审核员每月优秀案例上限"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="次" />
          </Form.Item>
          <Form.Item
            name={['effect', 'citation', 'tier1Count']}
            label="引用阶梯1 - 次数上限"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="次" />
          </Form.Item>
          <Form.Item
            name={['effect', 'citation', 'tier1Points']}
            label="引用阶梯1 - 每次得分"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分" />
          </Form.Item>
          <Form.Item
            name={['effect', 'citation', 'tier2Count']}
            label="引用阶梯2 - 次数上限"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="次" />
          </Form.Item>
          <Form.Item
            name={['effect', 'citation', 'tier2Points']}
            label="引用阶梯2 - 每次得分"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分" />
          </Form.Item>
          <Form.Item
            name={['effect', 'citation', 'tier3Points']}
            label="引用阶梯3 - 每次得分"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} step={0.1} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分" />
          </Form.Item>
          <Form.Item
            name={['effect', 'like', 'pointsPerLike']}
            label="获赞 - 每次得分"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} className={classNames('point-config-form-full-width', styles['point-config-form-full-width'])} addonAfter="分" />
          </Form.Item>
          <Form.Item
            name={['effect', 'excludeSelf']}
            label="本人引用/点赞不计分"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
};

export default PointConfigForm;

export const DEFAULT_POINT_CONFIG_FORM: PointConfig = {
  base: { pointsPerFile: 10 },
  quality: { high: 15, medium: 8, low: 0 },
  effect: {
    citation: { tier1Count: 10, tier1Points: 2, tier2Count: 100, tier2Points: 1, tier3Points: 0.1 },
    like: { pointsPerLike: 5 },
    excludeSelf: true,
  },
  behavior: { excellentCasePoints: 20, maxPerReviewerPerMonth: 5 },
};
