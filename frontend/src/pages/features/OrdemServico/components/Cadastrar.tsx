import { useState, useEffect } from 'react';
import Card from '../../../../components/Card';
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

const OPTIONS: OptionProps[] = [
  {
    label: 'Minigestério de Gestão e Inovação - MGI',
    value: 'Minigestério de Gestão e Inovação - MGI',
  },
  {
    label: 'Minigestério do Trabalho e Emprego - MTE',
    value: 'Minigestério do Trabalho e Emprego - MTE',
  },
  { label: 'Minigestério da Saúde - MS', value: 'Minigestério da Saúde - MS' },
  {
    label: 'Minigestério da Educação - MEC',
    value: 'Minigestério da Educação - MEC',
  },
  {
    label: 'Minigestério do Desenvolvimento Agrário - MDA',
    value: 'Minigestério do Desenvolvimento Agrário - MDA',
  },
  {
    label: 'Minigestério do Desenvolvimento Social e Combate à Fome - MDS',
    value: 'Minigestério do Desenvolvimento Social e Combate à Fome - MDS',
  },
];

const STATUS_OPTIONS: StatusOrdemServico[] = [
  'Cancelada',
  'Não Iniciada',
  'Em Análise',
  'Em Execução',
  'Para Aprovação',
  'Verificação',
  'Pendente',
  'Conclusão',
  'Encerrada',
];

interface PropsCadastrar {
  onSubmit?: (dados: OrdemServico) => void;
  osEditar?: OrdemServico;
}

const Cadastrar: React.FC<PropsCadastrar> = ({ onSubmit, osEditar }) => {
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
        osEditar.urgencia !== undefined
          ? String(osEditar.urgencia)
          : undefined
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

  return (
    <Card
      title={osEditar ? 'Editar Ordem de Serviço' : 'Cadastrar nova OS'}
      subtitle='Informe os campos necessários'>
      <Wizard
        passos={[
          {
            titulo: 'Identificação',
            conteudo: (
              <Identificacao
                options={OPTIONS}
                identificacao={identificacao}
                onChange={setIdentificacao}
              />
            ),
          },
          {
            titulo: 'Status da OS',
            conteudo: (
              <Select
                label='Status'
                options={STATUS_OPTIONS}
                value={status}
                onChange={(v) => setStatus(v as StatusOrdemServico)}
              />
            ),
          },
          {
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
          },
          {
            titulo: 'Cronograma',
            conteudo: (
              <Cronograma dados={cronograma} onChange={setCronograma} />
            ),
          },
          {
            titulo: 'Dimensionamento',
            conteudo: (
              <Dimensionamento
                setComplexidade={setComplexidade}
                setTipo={setTipo}
                complexidade={complexidade}
                tipo={tipo}
              />
            ),
          },
          {
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
          },
        ]}
        ativo={passoAtivo}
        alterar={(i) => setPassoAtivo(i)}
        cancelar={() => (window.location.href = '/os')}
        concluir={() => handleSubmit()}
      />
    </Card>
  );
};

export default Cadastrar;
