import React from 'react';

import { LabelsInput } from '../../../components/ui/labels-input';

interface ArrayTagInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
}

export const ArrayTagInput: React.FC<ArrayTagInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Add item and press Enter',
  disabled = false,
  readonly = false,
}) => {
  return (
    <LabelsInput
      value={value}
      onChange={(next) => onChange?.(next)}
      placeholder={placeholder}
      disabled={disabled || readonly}
    />
  );
};
