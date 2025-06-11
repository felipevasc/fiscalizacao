import { BrTextarea } from '@govbr-ds/react-components';
import type { ChangeEvent } from 'react';

type TextareaProps = {
  label?: string;
  placeholder?: string;
  onChange?: (value: ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  style?: React.CSSProperties;
};

const Textarea: React.FC<TextareaProps> = ({
  label,
  onChange,
  placeholder,
  value,
  style
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
