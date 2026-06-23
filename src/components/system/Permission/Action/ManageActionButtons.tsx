import type { PermissionDefinitionsResponse, RoleConfig } from '@/types';
import React from 'react';
import { AddButton } from './';

interface ManageActionButtonsProps {
  onSuccess: () => void;
  existingRoles: RoleConfig[];
  definitions: PermissionDefinitionsResponse | null;
}

const ManageActionButtons: React.FC<ManageActionButtonsProps> = ({
  onSuccess,
  existingRoles,
  definitions,
}) => {
  return (
    <AddButton onSuccess={onSuccess} existingRoles={existingRoles} definitions={definitions} />
  );
};

export default ManageActionButtons;
