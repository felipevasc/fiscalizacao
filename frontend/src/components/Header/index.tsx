import { BrHeader } from '@govbr-ds/react-components';
import osIniciais from '../../assets/OS_TR.json';

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
          //icone para resetar
          icon: 'sync-alt',
          label: 'Resetar OS',
          onClick: () => {
            if (osIniciais) {
              localStorage.setItem('sistema_os', JSON.stringify(osIniciais));
            }
          },
        },
      ]}
      showLoginButton={true}
      density='small'
      loggedIn={true}
      quickAccessLinks={[
        {
          label: 'Acompanhamento',
          onClick: () => (window.location.href = '/os/acompanhamento'),
        },
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
