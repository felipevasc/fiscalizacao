import { useState, type FormEvent } from 'react';
import Card from '../../../../components/Card';
import { type OptionProps } from '../../../../components/Select';
import Textarea from '../../../../components/Textarea';
import Itens, { type Item } from './Itens';
import Cronograma, { type DadosCronogramaType } from './Cronograma';
import Identificacao, { type IdentificacaoData } from './Identificacao';

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

interface PropsCadastrar {
  onSubmit?: (dados: {
    identificacao: IdentificacaoData;
    itens: Item[];
    cronograma: DadosCronogramaType;
    instrucoes?: string;
  }) => void;
}

const Cadastrar: React.FC<PropsCadastrar> = ({ onSubmit }) => {
  const [itens, setItens] = useState<Item[]>([]);
  const [cronograma, setCronograma] = useState<DadosCronogramaType>({
    data_inicio: '',
    data_fim: '',
    tabela: [],
  });
  const [identificacao, setIdentificacao] = useState<IdentificacaoData>({
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
  });
  const [instrucoes, setInstrucoes] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ identificacao, itens, cronograma, instrucoes });
    }
  };

  return (
    <Card title='Cadastrar nova OS' subtitle='Informe os campos necessários'>
      <form id='form-cadastrar' onSubmit={handleSubmit}>
        <div className='h4'>Identificação</div>
        <Identificacao
          options={OPTIONS}
          identificacao={identificacao}
          onChange={(i) => setIdentificacao(i)}
        />
        <div className='h4'>
          Especificações dos bens/serviços e volumes estimados
        </div>
        <Itens itens={itens} onChange={(i) => setItens(i)} />
        <div className='h4'>Instruções/Especificações complementares</div>
        <Textarea
          label='Instruções/Especificações complementares'
          value={instrucoes}
          onChange={(e) => setInstrucoes(e.target.value)}
        />
        <Cronograma onChange={(c) => setCronograma(c)} dados={cronograma} />
      </form>
    </Card>
  );
};

export default Cadastrar;
