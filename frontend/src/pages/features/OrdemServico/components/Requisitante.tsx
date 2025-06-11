import React from 'react';
import Input from '../../../../components/Input';
import FormGroup from '../../../../components/FormGroup';
import Select, { type OptionProps } from '../../../../components/Select';
import type { IdentificacaoData } from '../types/IdentificacaoData';

interface IdentificacaoProps {
  identificacao: IdentificacaoData;
  onChange: (novosDados: IdentificacaoData) => void;
  options: OptionProps[];
}

const Requisitante: React.FC<IdentificacaoProps> = ({
  identificacao,
  onChange,
  options,
}) => {
  // Função genérica para atualizar campos simples
  const handleChange = (field: keyof IdentificacaoData, value: string) => {
    onChange({
      ...identificacao,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      [field]: value,
    });
  };

  return (
    <div>
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
    </div>
  );
};

export default Requisitante;
