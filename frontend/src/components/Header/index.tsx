import { BrHeader } from '@govbr-ds/react-components';

type HeaderProps = {
  title?: string;
  subtitle?: string;
  urlLogo?: string;
  signature?: string;
};

const Header: React.FC<HeaderProps> = ({
  subtitle,
  title,
  signature,
  urlLogo,
}) => {
  return (
    <BrHeader
      subTitle={subtitle}
      title={title}
      urlLogo={urlLogo}
      signature={signature}
      features={[
        {
          icon: 'chart-bar',
          label: 'Funcionalidade 1',
          onClick: function Dc() {},
        },
        {
          icon: 'file-contract',
          label: 'Funcionalidade 2',
          onClick: function Dc() {},
        },
        {
          icon: 'clipboard-list',
          label: 'Funcionalidade 3',
          onClick: function Dc() {},
        },
        {
          icon: 'adjust',
          label: 'Funcionalidade 4',
          onClick: function Dc() {},
        },
      ]}
      showLoginButton={true}
      density='small'
      loggedIn={true}
      quickAccessLinks={[
        {
          label: 'Cadastrar OS',
          onClick: () => (window.location.href = '/os'),
        },
        {
          label: 'Verificar Indicadores',
          onClick: () => (window.location.href = '/indicadores'),
        },
      ]}
    />
  );
};

export default Header;
