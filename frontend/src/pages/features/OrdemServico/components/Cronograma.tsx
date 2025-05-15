import React from 'react';
import Input from '../../../../components/Input';
import Timeline from './Timeline';

interface LinhaCronograma {
  item: number;
  tarefaEntrega: string;
  inicio: string; 
  fim: string;
}

export interface DadosCronogramaType {
  data_inicio: string; 
  data_fim: string;
  tabela: LinhaCronograma[];
}

interface CronogramaProps {
  dados: DadosCronogramaType;
  onChange: (novosDados: DadosCronogramaType) => void;
}

const aplicarMascaraData = (valor: string) => {
  const numeros = valor.replace(/\D/g, '');

  let resultado = '';

  if (numeros.length > 0) resultado += numeros.substring(0, 2);
  if (numeros.length >= 3) resultado += '/' + numeros.substring(2, 4);
  if (numeros.length >= 5) resultado += '/' + numeros.substring(4, 8);
  return resultado;
};

const Cronograma: React.FC<CronogramaProps> = ({ dados, onChange }) => {
  const handleDataChange = (
    field: 'data_inicio' | 'data_fim',
    value: string
  ) => {
    const valorFormatado = aplicarMascaraData(value);
    onChange({
      ...dados,
      [field]: valorFormatado,
    });
  };

  const handleTabelaChange = (
    index: number,
    field: keyof Omit<LinhaCronograma, 'item'>,
    value: string
  ) => {
    const valorFormatado =
      field === 'inicio' || field === 'fim' ? aplicarMascaraData(value) : value;

    const novaTabela = [...dados.tabela];
    novaTabela[index] = { ...novaTabela[index], [field]: valorFormatado };
    onChange({
      ...dados,
      tabela: novaTabela,
    });
  };

  const adicionarLinha = () => {
    const novaLinha: LinhaCronograma = {
      item:
        dados.tabela.length > 0
          ? dados.tabela[dados.tabela.length - 1].item + 1
          : 1,
      tarefaEntrega: '',
      inicio: '',
      fim: '',
    };
    onChange({
      ...dados,
      tabela: [...dados.tabela, novaLinha],
    });
  };

  const removerLinha = (index: number) => {
    const novaTabela = dados.tabela.filter((_, i) => i !== index);
    const tabelaRenumerada = novaTabela.map((linha, i) => ({
      ...linha,
      item: i + 1,
    }));
    onChange({
      ...dados,
      tabela: tabelaRenumerada,
    });
  };

  return (
    <div>
      <div className='h4'>Datas e prazos previstos</div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <Input
            label='Data de Início'
            value={dados.data_inicio}
            placeholder='dd/mm/aaaa'
            maxLength={10}
            onChange={(e) => handleDataChange('data_inicio', e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Input
            label='Data do Fim'
            value={dados.data_fim}
            placeholder='dd/mm/aaaa'
            maxLength={10}
            onChange={(e) => handleDataChange('data_fim', e.target.value)}
          />
        </div>
      </div>

      <h4>CRONOGRAMA DE EXECUÇÃO/ENTREGA</h4>
      <Timeline cronograma={dados} />
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: 16,
        }}>
        <thead>
          <tr style={{ backgroundColor: '#ddd' }}>
            <th style={{ border: '1px solid #999', padding: 8, width: 50 }}>
              Item
            </th>
            <th style={{ border: '1px solid #999', padding: 8 }}>
              Tarefa/entrega
            </th>
            <th style={{ border: '1px solid #999', padding: 8, width: 150 }}>
              Início
            </th>
            <th style={{ border: '1px solid #999', padding: 8, width: 150 }}>
              Fim
            </th>
            <th style={{ border: '1px solid #999', padding: 8, width: 100 }}>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {dados.tabela.map((linha, i) => (
            <tr key={linha.item}>
              <td
                style={{
                  border: '1px solid #999',
                  padding: 8,
                  textAlign: 'center',
                  userSelect: 'none',
                }}>
                {linha.item}
              </td>
              <td style={{ border: '1px solid #999', padding: 8 }}>
                <Input
                  value={linha.tarefaEntrega}
                  onChange={(e) =>
                    handleTabelaChange(i, 'tarefaEntrega', e.target.value)
                  }
                />
              </td>
              <td style={{ border: '1px solid #999', padding: 8 }}>
                <Input
                  value={linha.inicio}
                  placeholder='dd/mm/aaaa'
                  maxLength={10}
                  onChange={(e) =>
                    handleTabelaChange(i, 'inicio', e.target.value)
                  }
                />
              </td>
              <td style={{ border: '1px solid #999', padding: 8 }}>
                <Input
                  value={linha.fim}
                  placeholder='dd/mm/aaaa'
                  maxLength={10}
                  onChange={(e) => handleTabelaChange(i, 'fim', e.target.value)}
                />
              </td>
              <td
                style={{
                  border: '1px solid #999',
                  padding: 8,
                  textAlign: 'center',
                }}>
                <button
                  type='button'
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                  onClick={() => removerLinha(i)}>
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type='button'
        onClick={adicionarLinha}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}>
        Adicionar Linha
      </button>
    </div>
  );
};

export default Cronograma;
