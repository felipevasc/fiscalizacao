import React from 'react';
import type { TipoOrdemServico } from '../types/TipoOrdemServico';
import type { ComplexidadeOrdemServico } from '../types/ComplexidadeOrdemServico';
import { BrButton } from '@govbr-ds/react-components';
import { Input } from '../../../../components';

const OPCOES_TIPO: { valor: TipoOrdemServico; rotulo: string }[] = [
  { valor: 'Desenho', rotulo: 'Desenho' },
  { valor: 'Melhoria', rotulo: 'Melhoria de Processo' },
  { valor: 'Integração', rotulo: 'Integração de Sistemas' },
];

const OPCOES_COMPLEXIDADE: {
  valor: ComplexidadeOrdemServico;
  rotulo: string;
}[] = [
  { valor: 'Baixa', rotulo: 'Baixa Complexidade' },
  { valor: 'Média', rotulo: 'Média Complexidade' },
  { valor: 'Alta', rotulo: 'Alta Complexidade' },
];

type PropsDimensionamento = {
  tipo?: TipoOrdemServico;
  complexidade?: ComplexidadeOrdemServico;
  setTipo: (valor: TipoOrdemServico) => void;
  setComplexidade: (valor: ComplexidadeOrdemServico) => void;
  setRoi?: (valor: number) => void;
  roi?: number;
};

type PropsBotaoOpcao<T extends string> = {
  valorOpcao: T;
  rotulo: string;
  estaSelecionado: boolean;
  aoClicar: (valor: T) => void;
  estaDesabilitado?: boolean;
  className?: string;
};

const BotaoOpcao = <T extends string>({
  valorOpcao,
  rotulo,
  estaSelecionado,
  aoClicar,
  estaDesabilitado = false,
  className = '',
}: PropsBotaoOpcao<T>) => {
  let classesBaseBotao = `
    govbr-botao
    px-3 py-2 mx-1 my-1 rounded-md border font- Média text-sm
    transition-colors transition-border-color duration-150 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400
    flex items-center justify-center text-center min-w-[150px] h-[44px]
  `;

  if (estaDesabilitado) {
    classesBaseBotao += `
      govbr-botao-desabilitado
      bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed
    `;
  } else if (estaSelecionado) {
    classesBaseBotao += `
      govbr-botao-selecionado
      bg-blue-gov-primario border-blue-gov-primario-darken text-white font-semibold shadow-sm
    `;
  } else {
    classesBaseBotao += `
      govbr-botao-padrao
      bg-white border-gray-400 text-blue-gov-primario
      hover:bg-gray-50 hover:border-blue-gov-primario
    `;
  }

  return (
    <BrButton
      type='button'
      className={`${classesBaseBotao} ${className}`}
      onClick={() => !estaDesabilitado && aoClicar(valorOpcao)}
      disabled={estaDesabilitado}
      aria-pressed={estaSelecionado}
      aria-disabled={estaDesabilitado}
      secondary={!estaSelecionado}
      primary={estaSelecionado}>
      {rotulo}
    </BrButton>
  );
};

const Dimensionamento: React.FC<PropsDimensionamento> = ({
  setComplexidade: definirComplexidade,
  setTipo: definirTipo,
  complexidade,
  tipo,
  setRoi,
  roi
}) => {
  const lidarComSelecaoTipo = (tipoSelecionado: TipoOrdemServico) => {
    if (tipo === tipoSelecionado) {
      definirTipo('');
      definirComplexidade('');
    } else {
      definirTipo(tipoSelecionado);
      definirComplexidade('');
    }
  };

  const lidarComSelecaoComplexidade = (
    complexidadeSelecionada: ComplexidadeOrdemServico
  ) => {
    definirComplexidade(complexidadeSelecionada);
  };

  return (
    <div className='govbr-componente'>
      <div className='h4'>
        Dimensionamento da Ordem de Serviço
      </div>

      <div className='space-y-6'>
        <fieldset className='space-y-3'>
          <legend
            id='legenda-tipo'
            className='block text-base font-medium text-gray-600 mb-2'>
            Tipo da Ordem de Serviço
          </legend>
          <div
            className='flex flex-wrap gap-1'
            role='radiogroup'
            aria-labelledby='legenda-tipo'>
            {OPCOES_TIPO.map((opcao) => (
              <BotaoOpcao
                key={opcao.valor}
                valorOpcao={opcao.valor}
                rotulo={opcao.rotulo}
                estaSelecionado={tipo === opcao.valor}
                aoClicar={lidarComSelecaoTipo}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className='space-y-3'>
          <legend
            id='legenda-complexidade'
            className={`block text-base font-medium text-gray-600 mb-2 transition-opacity duration-300 ${
              !tipo ? 'opacity-50 cursor-default' : 'opacity-100'
            }`}>
            Complexidade da Ordem de Serviço
          </legend>
          <div
            className='flex flex-wrap gap-1'
            role='radiogroup'
            aria-labelledby='legenda-complexidade'>
            {OPCOES_COMPLEXIDADE.map((opcao) => (
              <BotaoOpcao
                key={opcao.valor}
                valorOpcao={opcao.valor}
                rotulo={opcao.rotulo}
                estaSelecionado={complexidade === opcao.valor}
                aoClicar={lidarComSelecaoComplexidade}
                estaDesabilitado={!tipo}
              />
            ))}
          </div>
          {!tipo && (
            <p className='text-xs text-gray-500 mt-1 italic' role='status'>
              Selecione um Tipo para habilitar as opções de Complexidade.
            </p>
          )}
        </fieldset>

        <fieldset className='space-y-3'>
          <legend
            id='legenda-complexidade'
            className={`block text-base font-medium text-gray-600 mb-2 transition-opacity duration-300 ${
              !tipo ? 'opacity-50 cursor-default' : 'opacity-100'
            }`}>
            Retorno previsto
          </legend>
          <Input 
            value={roi?.toString() ?? ''}
            onChange={(e) => setRoi && setRoi(parseFloat(e.target.value))}
            type='number'
          />
          {!tipo && (
            <p className='text-xs text-gray-500 mt-1 italic' role='status'>
              Selecione um Tipo para habilitar as opções de Complexidade.
            </p>
          )}
        </fieldset>
      </div>
    </div>
  );
};

export default Dimensionamento;
