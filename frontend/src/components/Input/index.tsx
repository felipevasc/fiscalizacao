import { BrInput } from '@govbr-ds/react-components';
import type { ChangeEvent } from 'react';

type InputProps = {
  label?: string;
  placeholder?: string;
  maxLength?: number;
  onChange?: (value: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  type?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  maxLength,
  onChange,
  placeholder,
  value,
  type = 'text',
}) => {
  return (
    <BrInput
      label={label}
      maxLength={maxLength}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      type={type}
    />
  );
};

export default Input;
