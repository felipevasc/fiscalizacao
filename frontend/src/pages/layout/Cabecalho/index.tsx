import Header from '../../../components/Header';
import logo from '../../../assets/img/govbr-logo.png';

const Cabecalho = () => {
  return (
    <Header
      title='Sistema de Gerenciamento de Contratos'
      subtitle='Gerenciamento do contrato de ATI'
      urlLogo={logo}
      signature='Políticas Públicas por ATIs'
    />
  );
};

export default Cabecalho;
