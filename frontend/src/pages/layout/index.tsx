import Cabecalho from './Cabecalho';
import Conteudo from './Conteudo';
import Rodape from './Rodape';
import { StyledContent } from './styles';

const Layout = () => {
  return (
    <StyledContent>
      <Cabecalho />
      <Conteudo />
    </StyledContent>
  );
};

export default Layout;
