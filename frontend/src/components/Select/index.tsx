import { BrSelect } from '@govbr-ds/react-components';
import { useMemo } from 'react';

export type OptionProps = {
  label: string;
  value: string;
};

type SelectProps = {
  options: OptionProps[] | string[];
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
};

const Select: React.FC<SelectProps> = ({
  options,
  label,
  onChange,
  placeholder,
  value,
  disabled = false,
}) => {
  const optionsUsadas = useMemo(
    () =>
      options.map((option) => {
        if (typeof option === 'string') {
          return { label: option, value: option };
        }
        return option;
      }),
    [options]
  );
  return (
    <BrSelect
      options={optionsUsadas}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
    />
  );
};

export default Select;
