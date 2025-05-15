import { BrTextarea } from '@govbr-ds/react-components';
import type { ChangeEvent } from 'react';

type TextareaProps = {
  label?: string;
  placeholder?: string;
  onChange?: (value: ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
};

const Textarea: React.FC<TextareaProps> = ({
  label,
  onChange,
  placeholder,
  value,
}) => {
  return (
    <BrTextarea
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  );
};

export default Textarea;
