import React from 'react';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/Textarea';
import FormGroup from '../../../../components/FormGroup';
import type { IdentificacaoData } from '../types/IdentificacaoData';



interface IdentificacaoProps {
  identificacao: IdentificacaoData;
  onChange: (novosDados: IdentificacaoData) => void;
}

const Identificacao: React.FC<IdentificacaoProps> = ({
  identificacao,
  onChange,
}) => {
  // Função genérica para atualizar campos simples
  const handleChange = (field: keyof IdentificacaoData, value: string) => {
    onChange({
      ...identificacao,
      dataEmissao: (new Date()).toLocaleDateString('pt-BR'),
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
          value={(new Date()).toLocaleDateString('pt-BR')}
          onChange={(e) => handleChange('dataEmissao', e.target.value)}
        />
      </FormGroup>

      <Input
        label='CONTRATO/NOTA DE EMPENHO nº'
        value={identificacao.contratoNota}
        onChange={(e) => handleChange('contratoNota', e.target.value)}
      />

      <Textarea
        label='Objeto do Contrato'
        value={identificacao.objetoContrato}
        onChange={(e) => handleChange('objetoContrato', e.target.value)}
      />

      <FormGroup>
        <Input
          label='Contratada'
          value={identificacao.contratada}
          onChange={(e) => handleChange('contratada', e.target.value)}
        />
        <Input
          label='CNPJ'
          value={identificacao.cnpj}
          onChange={(e) => handleChange('cnpj', e.target.value)}
        />
      </FormGroup>

      <Input
        label='Preposto'
        value={identificacao.preposto}
        onChange={(e) => handleChange('preposto', e.target.value)}
      />

      <FormGroup>
        <Input
          label='Início Vigência'
          value={identificacao.inicioVigencia}
          onChange={(e) => handleChange('inicioVigencia', e.target.value?.replace(/\D/g, '').replace(/(\d{1,2})(\d{1,2})(\d{1,4})/, "$1/$2/$3"))}
        />
        <Input
          label='Fim Vigência'
          value={identificacao.fimVigencia}
          onChange={(e) => handleChange('fimVigencia', e.target.value?.replace(/\D/g, '').replace(/(\d{1,2})(\d{1,2})(\d{1,4})/, "$1/$2/$3"))}
        />
      </FormGroup>
    </div>
  );
};

export default Identificacao;
