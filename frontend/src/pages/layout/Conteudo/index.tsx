import RotasInternas from '../../../routes';
import Rodape from '../Rodape';
import { StyledConteudo } from '../styles';

const Conteudo = () => {
  return (
    <StyledConteudo>
      <RotasInternas />
      <Rodape />
    </StyledConteudo>
  );
};

export default Conteudo;
