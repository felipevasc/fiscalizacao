import { useState, useEffect } from 'react';
import { type OptionProps } from '../../../../components/Select';
import Textarea from '../../../../components/Textarea';
import Itens from './Itens';
import Select from '../../../../components/Select';

import { calcularUdpPrazo } from '../functions';
import type { StatusOrdemServico } from '../types/StatusOrdemServico';
import type { OrdemServico } from '../types/OrdemServico';
import type { Item } from '../types/Item';
import type { DadosCronogramaType } from '../types/DadosCronogramaType';
import type { TipoOrdemServico } from '../types/TipoOrdemServico';
import type { ComplexidadeOrdemServico } from '../types/ComplexidadeOrdemServico';
import type { IdentificacaoData } from '../types/IdentificacaoData';
import Identificacao from './Identificacao';
import Cronograma from './Cronograma';
import MatrizGUT from './MatrizGUT';
import Dimensionamento from './Dimensionamento';
import Wizard from '../../../../components/Wizard';
import Requisitante from './Requisitante';

const OPTIONS: OptionProps[] = [
  {
    label:
      'MDIC - Ministério do Desenvolvimento, Indústria, Comércio e Serviços',
    value:
      'MDIC - Ministério do Desenvolvimento, Indústria, Comércio e Serviços',
  },
  {
    label:
      'MEMP — Ministério do Empreendedorismo, da Microempresa e da Empresa de Pequeno Porte',
    value:
      'MEMP — Ministério do Empreendedorismo, da Microempresa e da Empresa de Pequeno Porte',
  },
  {
    label: 'MF - Ministério da Fazenda',
    value: 'MF - Ministério da Fazenda',
  },
  {
    label: 'MGI - Minigestério de Gestão e Inovação',
    value: 'MGI - Minigestério de Gestão e Inovação',
  },
  {
    label: 'MPO - Ministério do Planejamento e Orçamento',
    value: 'MPO - Ministério do Planejamento e Orçamento',
  },
  {
    label: 'MPI - Ministério dos Povos Indígenas',
    value: 'MPI - Ministério dos Povos Indígenas',
  },
  {
    label: 'MDHC - Ministério dos Direitos Humanos e da Cidadania',
    value: 'MDHC - Ministério dos Direitos Humanos e da Cidadania',
  },
  {
    label: 'MESP - Ministério do Esporte',
    value: 'MESP - Ministério do Esporte',
  },
  {
    label: 'MIR - Ministério da Igualdade Racial',
    value: 'MIR - Ministério da Igualdade Racial',
  },
  {
    label: 'MIN - Ministério das Mulheres',
    value: 'MIN - Ministério das Mulheres',
  },
  {
    label: 'MPS - Ministério da Previdência Social',
    value: 'MPS - Ministério da Previdência Social',
  },
  {
    label: 'MPOR - Ministério de Portos e Aeroportos',
    value: 'MPOR - Ministério de Portos e Aeroportos',
  },
  {
    label: 'MTUR - Ministério do Turismo',
    value: 'MTUR - Ministério do Turismo',
  },
];

const STATUS_OPTIONS: StatusOrdemServico[] = [
  'Cancelada',
  'Não Iniciada',
  'Priorizada',
  'Em Execução',
  'Recebimento Provisorio',
  'Validação',
  'Recebimento Definitivo',
  'Para pagamento',
  'Encerrada',
];

interface PropsCadastrar {
  onSubmit?: (dados: OrdemServico) => void;
  osEditar?: OrdemServico;
  avaliar?: boolean;
}

const Cadastrar: React.FC<PropsCadastrar> = ({
  onSubmit,
  osEditar,
  avaliar,
}) => {
  const [itens, setItens] = useState<Item[]>(osEditar?.itens || []);
  const [cronograma, setCronograma] = useState<DadosCronogramaType>(
    osEditar?.cronograma || { data_inicio: '', data_fim: '', tabela: [] }
  );
  const [gravidade, setGravidade] = useState<string | undefined>(
    osEditar?.gravidade !== undefined ? String(osEditar.gravidade) : undefined
  );
  const [urgencia, setUrgencia] = useState<string | undefined>(
    osEditar?.urgencia !== undefined ? String(osEditar.urgencia) : undefined
  );
  const [tendencia, setTendencia] = useState<string | undefined>(
    osEditar?.tendencia !== undefined ? String(osEditar.tendencia) : undefined
  );
  const [tipo, setTipo] = useState<TipoOrdemServico>(osEditar?.tipo || '');
  const [complexidade, setComplexidade] = useState<ComplexidadeOrdemServico>(
    osEditar?.complexidade || ''
  );
  const [roi, setRoi] = useState<number>(
    osEditar?.roi || 0
  );
  const [passoAtivo, setPassoAtivo] = useState<number>(1);

  const [identificacao, setIdentificacao] = useState<IdentificacaoData>(
    osEditar?.identificacao || {
      numeroOS: '',
      dataEmissao: '',
      contratoNota: '',
      objetoContrato: '',
      contratada: 'BPMX-SERVICE LTDA',
      cnpj: '13.797.698/0001-37',
      preposto: 'BERNARDO PAULO MATIAS SCHUAN',
      inicioVigencia: '',
      fimVigencia: '',
      unidade: '',
      solicitante: '',
      email: '',
    }
  );
  const [instrucoes, setInstrucoes] = useState(osEditar?.instrucoes || '');
  const [status, setStatus] = useState<StatusOrdemServico>(
    osEditar?.status ?? 'Não Iniciada'
  );

  const handleSetGravidade = (val?: string) => setGravidade(val);
  const handleSetUrgencia = (val?: string) => setUrgencia(val);
  const handleSetTendencia = (val?: string) => setTendencia(val);

  useEffect(() => {
    if (osEditar) {
      setItens(osEditar.itens);
      setCronograma(osEditar.cronograma);
      setIdentificacao(osEditar.identificacao);
      setInstrucoes(osEditar.instrucoes || '');
      setStatus(osEditar.status);
      setGravidade(
        osEditar.gravidade !== undefined
          ? String(osEditar.gravidade)
          : undefined
      );
      setUrgencia(
        osEditar.urgencia !== undefined ? String(osEditar.urgencia) : undefined
      );
      setTendencia(
        osEditar.tendencia !== undefined
          ? String(osEditar.tendencia)
          : undefined
      );
    }
  }, [osEditar]);

  const handleSubmit = () => {
    const { udp, prazo } = calcularUdpPrazo(
      tipo as TipoOrdemServico,
      complexidade as ComplexidadeOrdemServico
    );

    if (onSubmit) {
      const g = parseInt(gravidade ?? '0'),
        u = parseInt(urgencia ?? '0'),
        t = parseInt(tendencia ?? '0');
      const gutScore = g * u * t;
      onSubmit({
        identificacao,
        itens,
        cronograma,
        instrucoes,
        status,
        gravidade: g,
        urgencia: u,
        tendencia: t,
        gutScore,
        tipo,
        complexidade,
        udp,
        prazoDiasUteis: prazo,
      });
    }
  };

  const passosOS = () => {
    const passos = [];
    if (!avaliar) {
      passos.push({
        titulo: 'Identificação',
        conteudo: (
          <>
            <Identificacao
              identificacao={identificacao}
              onChange={setIdentificacao}
              options={OPTIONS}
            />
            <Select
              label='Status'
              options={osEditar?.id ? STATUS_OPTIONS : ['Não Iniciada']}
              value={status}
              onChange={(v) => setStatus(v as StatusOrdemServico)}
              disabled={true}
            />
          </>
        ),
      });
      passos.push({
        titulo: 'Especificações',
        conteudo: (
          <>
            <Itens itens={itens} onChange={setItens} />
            <hr />
            <Textarea
              label='Instruções/Especificações complementares'
              value={instrucoes}
              onChange={(e) => setInstrucoes(e.target.value)}
            />
          </>
        ),
      });
    }
    passos.push({
      titulo: 'Cronograma',
      conteudo: <Cronograma dados={cronograma} onChange={setCronograma} />,
    });
    passos.push({
      titulo: 'Dimensionamento',
      conteudo: (
        <Dimensionamento
          setComplexidade={setComplexidade}
          setTipo={setTipo}
          complexidade={complexidade}
          tipo={tipo}
          setRoi={setRoi}
          roi={roi}
        />
      ),
    });
    passos.push({
      titulo: 'Priorização',
      conteudo: (
        <MatrizGUT
          gravidade={gravidade}
          setGravidade={handleSetGravidade}
          setTendencia={handleSetTendencia}
          tendencia={tendencia}
          setUrgencia={handleSetUrgencia}
          urgencia={urgencia}
        />
      ),
    });
    return passos;
  };

  return (
    <Wizard
      passos={passosOS()}
      ativo={passoAtivo}
      alterar={(i) => setPassoAtivo(i)}
      cancelar={() => (window.location.href = '/os')}
      concluir={() => handleSubmit()}
    />
  );
};

export default Cadastrar;
