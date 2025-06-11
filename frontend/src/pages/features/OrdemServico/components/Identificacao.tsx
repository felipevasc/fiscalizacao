import React from 'react';
import Input from '../../../../components/Input';
import FormGroup from '../../../../components/FormGroup';
import type { IdentificacaoData } from '../types/IdentificacaoData';
import { Select } from '../../../../components';
import type { OptionProps } from '../../../../components/Select';

interface IdentificacaoProps {
  identificacao: IdentificacaoData;
  onChange: (novosDados: IdentificacaoData) => void;
  options: OptionProps[];
}

const Identificacao: React.FC<IdentificacaoProps> = ({
  identificacao,
  onChange,
  options,
}) => {
  // Função genérica para atualizar campos simples
  const handleChange = (field: keyof IdentificacaoData, value: string) => {
    onChange({
      ...identificacao,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      contratoNota: '12804.100067/2023-71',
      objetoContrato:
        'Solução de Gerenciamento de Processos de Negócio (BPMS) e Serviços Relacionados',
      contratada: 'BPMX-SERVICE LTDA',
      cnpj: '13.797.698/0001-37',
      preposto: 'BERNARDO PAULO MATIAS SCHUAN',
      inicioVigencia: '28/05/2024',
      fimVigencia: '28/05/2027',
      [field]: value,
    });
  };

  return (
    <div>
      <FormGroup>
        <Input
          label='N° da OS'
          value={identificacao.numeroOS}
          onChange={(e) => handleChange('numeroOS', e.target.value)}
        />
        <Input
          label='Data de Emissão'
          value={new Date().toLocaleDateString('pt-BR')}
          onChange={(e) => handleChange('dataEmissao', e.target.value)}
          readonly={true}
        />
      </FormGroup>
      <Select
        label='Unidade'
        options={options}
        value={identificacao.unidade}
        onChange={(e) => handleChange('unidade', e)}
      />

      <FormGroup>
        <Input
          label='Solicitante'
          value={identificacao.solicitante}
          onChange={(e) => handleChange('solicitante', e.target.value)}
        />
        <Input
          label='E-mail'
          value={identificacao.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </FormGroup>
      <Input
        label='CONTRATO/NOTA DE EMPENHO nº'
        value={'12804.100067/2023-71'}
        onChange={(e) => handleChange('contratoNota', e.target.value)}
        readonly={true}
      />

      <Input
        label='Objeto do Contrato'
        value={
          'Solução de Gerenciamento de Processos de Negócio (BPMS) e Serviços Relacionados'
        }
        onChange={(e) => handleChange('objetoContrato', e.target.value)}
        readonly={true}
      />

      <FormGroup>
        <Input
          label='Contratada'
          value={identificacao.contratada}
          readonly={true}
        />
        <Input label='CNPJ' value={identificacao.cnpj} readonly={true} />
      </FormGroup>
      <Input label='Preposto' value={identificacao.preposto} readonly={true} />

      <FormGroup>
        <Input
          label='Início Vigência'
          value={'28/05/2024'}
          onChange={(e) =>
            handleChange(
              'inicioVigencia',
              e.target.value
                ?.replace(/\D/g, '')
                .replace(/(\d{1,2})(\d{1,2})(\d{1,4})/, '$1/$2/$3')
            )
          }
          readonly={true}
        />
        <Input
          label='Fim Vigência'
          value={'28/05/2027'}
          onChange={(e) =>
            handleChange(
              'fimVigencia',
              e.target.value
                ?.replace(/\D/g, '')
                .replace(/(\d{1,2})(\d{1,2})(\d{1,4})/, '$1/$2/$3')
            )
          }
          readonly={true}
        />
      </FormGroup>
    </div>
  );
};

export default Identificacao;
