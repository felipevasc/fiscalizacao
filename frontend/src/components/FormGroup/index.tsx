import { StyledFormGroup } from './styles';

type FormGroupProps = {
  children?: React.ReactNode;
  qtd?: number;
};

const FormGroup: React.FC<FormGroupProps> = ({ children, qtd = 2 }) => {
  return (
    <StyledFormGroup className={`form-group-${qtd}`}>
      {children}
    </StyledFormGroup>
  );
};

export default FormGroup;
