import './styles.css';

export type PassoWizardProps = {
  titulo: string;
  conteudo: React.ReactNode;
};

type WizardProps = {
  passos: PassoWizardProps[];
  ativo: number;
  alterar: (proximo: number) => void;
  concluir: () => void;
  cancelar: () => void;
};

const Wizard: React.FC<WizardProps> = ({
  passos,
  ativo,
  alterar,
  concluir,
  cancelar,
}) => {
  return (
    <div className='wizard-sample-2'>
      <div className='br-wizard' {...{ vertical: 'vertical', step: 2 }}>
        <div className='wizard-progress' role='tablist'>
          {passos?.map((p, i) => (
            <button
              className='wizard-progress-btn'
              type='button'
              aria-labelledby='info1'
              role='tab'
              aria-controls='tab1'
              title='Dados Pessoais'
              {...{
                step: i + 1,
                active: ativo === i + 1 ? 'active' : undefined,
              }}>
              <span className='info' id='info1'>
                {p.titulo}
              </span>
            </button>
          ))}
        </div>
        <div className='wizard-form'>
          {passos?.map((p, i) => (
            <div
              key={`passo-${p.titulo}`}
              className='wizard-panel'
              {...{ active: i + 1 === ativo ? 'active' : undefined }}
              role='tabpanel'
              id='tab1'>
              <div className='wizard-panel-content'>
                <div className='h3'>{p.titulo}</div>
                <div className='text'>{p.conteudo}</div>
              </div>
              <div className='wizard-panel-btn'>
                <button
                  className='br-button wizard-btn-canc'
                  type='button'
                  onClick={() => cancelar()}>
                  Cancelar
                </button>
                {ativo < passos.length && (
                  <button
                    className='br-button primary wizard-btn-next'
                    type='button'
                    aria-description='Passo 2 de 5 Validar Dados'
                    onClick={() => alterar(ativo + 1)}>
                    {' '}
                    Avançar
                  </button>
                )}
                {ativo === passos.length && (
                  <button
                    className='br-button primary wizard-btn-next'
                    type='button'
                    onClick={() => concluir()}>
                    {' '}
                    Concluir
                  </button>
                )}
                {ativo > 1 && (
                  <button
                    className='br-button secondary wizard-btn-prev'
                    type='button'
                    onClick={() => alterar(ativo - 1)}>
                    Voltar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wizard;
