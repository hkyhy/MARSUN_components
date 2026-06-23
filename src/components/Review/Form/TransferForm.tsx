import type { PersonOption } from '@/components/Common';
import { PersonOptionRow } from '@/components/Common';
import { useDepartmentPath } from '@/hooks/useDepartmentPath';
import { useAuthStore } from '@/stores/authStore';
import {
  buildPersonOptionLookup,
  createPersonSelectFilter,
  resolvePersonDepartmentName,
  toDepartmentPathMaps,
  toPersonSelectOptions,
} from '@/utils/user/personOption';
import { Form, Input, Select } from 'antd';
import React, { useMemo } from 'react';

interface TransferFormProps {
  form: ReturnType<typeof Form.useForm>[0];
  reviewers: PersonOption[];
}

const TransferForm: React.FC<TransferFormProps> = ({ form, reviewers }) => {
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { pathMap } = useDepartmentPath();
  const maps = useMemo(() => toDepartmentPathMaps(pathMap), [pathMap]);

  const personOptions = useMemo(() => {
    const enriched = reviewers.map((opt) => ({
      ...opt,
      departmentName: resolvePersonDepartmentName(maps, opt.departmentId, opt.departmentName),
    }));
    return toPersonSelectOptions(enriched);
  }, [reviewers, maps]);

  const lookup = useMemo(() => buildPersonOptionLookup(personOptions), [personOptions]);

  const antdOptions = useMemo(
    () =>
      personOptions.map((opt) => ({
        value: opt.value,
        label: <PersonOptionRow option={opt} />,
        optionLabel: opt.optionLabel,
        disabled: opt.value === currentUserId,
      })),
    [personOptions, currentUserId],
  );

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="transferTo"
        label="转审给"
        rules={[{ required: true, message: '请选择转审人' }]}
      >
        <Select
          placeholder="选择转审人"
          options={antdOptions}
          showSearch
          optionLabelProp="optionLabel"
          filterOption={createPersonSelectFilter(lookup)}
        />
      </Form.Item>
      <Form.Item
        name="reason"
        label="转审原因"
        rules={[{ required: true, message: '请填写转审原因' }]}
      >
        <Input.TextArea rows={2} placeholder="请说明转审原因" />
      </Form.Item>
    </Form>
  );
};

export default TransferForm;
