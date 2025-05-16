import { useState, useEffect, type FormEvent } from 'react';
import Card from '../../../../components/Card';
import { type OptionProps } from '../../../../components/Select';
import Textarea from '../../../../components/Textarea';
import Itens, { type Item } from './Itens';
import Cronograma, { type DadosCronogramaType } from './Cronograma';
import Identificacao, { type IdentificacaoData } from './Identificacao';
import Select from '../../../../components/Select';
import { BrButton } from '@govbr-ds/react-components';
import FormGroup from '../../../../components/FormGroup';
import type { OrdemServico, StatusOrdemServico } from '../Listagem';

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
  const [gravidade, setGravidade] = useState<string>();
  const [urgencia, setUrgencia] = useState<string>();
  const [tendencia, setTendencia] = useState<string>();

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

  useEffect(() => {
    if (osEditar) {
      setItens(osEditar.itens);
      setCronograma(osEditar.cronograma);
      setIdentificacao(osEditar.identificacao);
      setInstrucoes(osEditar.instrucoes || '');
      setStatus(osEditar.status);
    }
  }, [osEditar]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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
      });
    }
  };

  return (
    <Card
      title={osEditar ? 'Editar Ordem de Serviço' : 'Cadastrar nova OS'}
      subtitle='Informe os campos necessários'>
      <form id='form-cadastrar' onSubmit={handleSubmit}>
        <div className='h4'>Identificação</div>
        <Identificacao
          options={OPTIONS}
          identificacao={identificacao}
          onChange={setIdentificacao}
        />
        <div className='h4'>Status da OS</div>
        <Select
          label='Status'
          options={STATUS_OPTIONS}
          value={status}
          onChange={(v) => setStatus(v as StatusOrdemServico)}
        />
        <div className='h4'>
          Especificações dos bens/serviços e volumes estimados
        </div>
        <Itens itens={itens} onChange={setItens} />
        <div className='h4'>Instruções/Especificações complementares</div>
        <Textarea
          label='Instruções/Especificações complementares'
          value={instrucoes}
          onChange={(e) => setInstrucoes(e.target.value)}
        />
        <Cronograma dados={cronograma} onChange={setCronograma} />
        <div className='h4'>Prioridade - Matriz GUT</div>
        <FormGroup>
          <Select
            label='Gravidade (1-5)'
            options={['1', '2', '3', '4', '5']}
            value={gravidade}
            onChange={(val) => setGravidade(val)}
          />
          <Select
            label='Urgência (1-5)'
            options={['1', '2', '3', '4', '5']}
            value={urgencia}
            onChange={(val) => setUrgencia(val)}
          />
          <Select
            label='Tendência (1-5)'
            options={['1', '2', '3', '4', '5']}
            value={tendencia}
            onChange={(val) => setTendencia(val)}
          />
        </FormGroup>
        <br />
        <BrButton
          secondary={true}
          type='button'
          onClick={() => (window.location.href = '/os')}>
          Voltar
        </BrButton>
        &nbsp;&nbsp;&nbsp;
        <BrButton primary={true} type='submit'>
          {osEditar ? 'Salvar Alterações' : 'Cadastrar OS'}
        </BrButton>
      </form>
    </Card>
  );
};

export default Cadastrar;
