import React, { useState } from 'react';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from '@mui/material';
import { BrButton } from '@govbr-ds/react-components';
import type { Item } from '../types/Item';
import { Select } from '../../../../components';

interface ItensProps {
  itens: Item[];
  onChange: (novosItens: Item[]) => void;
}

const PARAMETROS = [
  {
    id: '1',
    item: 'Serviços de licenciamento de Suíte BPMS em nuvem com suporte técnico aos usuários',
    metrica: 'Usuário/Mês',
    valor: 'R$ 230,00'
  },
  {
    id: '2',
    item: 'Serviços de modelagem, melhoria, automação e manutenção de processos na suíte licenciada',
    metrica: 'UDP',
    valor: 'R$ 1.850,00'
  },
  {
    id: '3',
    item: 'Serviços de capacitação de usuários na utilização dos processos automatizados e da suíte licenciada',
    metrica: 'Hora/Aula',
    valor: 'R$ 412,00'
  },
]

const Itens: React.FC<ItensProps> = ({ itens, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  const [novoItem, setNovoItem] = useState<Item>({
    item: '',
    descricao: '',
    metrica: '',
    valorUnitario: 0,
    quantidade: 0,
    valorTotal: 0,
  });

  const changeSelect = (value: string) => {
    const parametro = PARAMETROS.find((p) => p.item === value);
    if (parametro) {
      let val: string | number = value;
      handleChange('valorUnitario', parametro.valor);
      setNovoItem(i => ({...i, item: parametro.id, descricao: parametro.item, metrica: parametro.metrica} as Item));
    }
  }

  const handleChange = (field: keyof Item, value: string) => {
    let val: string | number = value;
    if (field === 'valorUnitario' || field === 'valorTotal') {
      val = value.replace(/\D/g, '').replace(/(\d)(\d{2})$/, '$1.$2');
      val = parseFloat(val);
      if (isNaN(val)) val = 0;
    }
    if (field === 'quantidade') {
      val = value.replace(/\D/g, '');
      val = parseFloat(val);
      if (isNaN(val)) val = 0;
    }
    const atualizado = { ...novoItem, [field]: val };

    if (field === 'valorUnitario' || field === 'quantidade') {
      atualizado.valorTotal = atualizado.valorUnitario * atualizado.quantidade;
    }
    setNovoItem(atualizado);
  };

  const adicionarItem = () => {
    if (!novoItem.descricao) {
      alert('Preencha os campos Item e Descrição.');
      return;
    }
    onChange([...itens, novoItem]);
    setNovoItem({
      item: itens.length + 1 + '',
      descricao: '',
      metrica: '',
      valorUnitario: 0,
      quantidade: 0,
      valorTotal: 0,
    });
    setShowModal(false);
  };

  const mediaValorUnitario =
    itens.length > 0
      ? itens.reduce((acc, i) => acc + i.valorUnitario, 0) / itens.length
      : 0;
  const mediaValorTotal =
    itens.length > 0
      ? itens.reduce((acc, i) => acc + i.valorTotal, 0) / itens.length
      : 0;

  return (
    <>
      <BrButton
        secondary={true}
        type='button'
        onClick={() => setShowModal(true)}>
        Adicionar item
      </BrButton>
      <Modal
        isOpen={showModal}
        title='Adicionar item'
        primaryAction={{ label: 'Adicionar', action: adicionarItem }}
        onClose={() => setShowModal(false)}>
        <Select
          options={PARAMETROS.map(p => p.item)}
          value={novoItem.descricao}
          onChange={(e) => changeSelect(e)}
        />
        <Input
          label='Qtde/Vol.'
          type='number'
          value={novoItem.quantidade.toString()}
          onChange={(e) => handleChange('quantidade', e.target.value)}
        />
        <Input
          label='Métrica'
          value={novoItem.metrica}
          readonly={true}

        />
        <Input
          label='Valor unitário (R$)'
          type='number'
          value={novoItem.valorUnitario.toFixed(2)}
          onChange={(e) => handleChange('valorUnitario', e.target.value)}
          readonly={true}
        />
        <Input
          label='Valor Total (R$)'
          type='number'
          value={novoItem.valorTotal.toFixed(2)}
          readonly={true}
        />
      </Modal>

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Métrica</TableCell>
            <TableCell align='right'>Valor Unitário (R$)</TableCell>
            <TableCell align='right'>Quantidade</TableCell>
            <TableCell align='right'>Valor Total (R$)</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {itens.map((i, idx) => (
            <TableRow key={idx}>
              <TableCell>{i.item}</TableCell>
              <TableCell>{i.descricao}</TableCell>
              <TableCell>{i.metrica}</TableCell>
              <TableCell align='right'>{i.valorUnitario.toFixed(2)}</TableCell>
              <TableCell align='right'>{i.quantidade}</TableCell>
              <TableCell align='right'>{i.valorTotal.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {itens.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} align='right' sx={{ fontWeight: 'bold' }}>
                Médias:
              </TableCell>
              <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                {mediaValorUnitario.toFixed(2)}
              </TableCell>
              <TableCell />
              <TableCell align='right' sx={{ fontWeight: 'bold' }}>
                {mediaValorTotal.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
};

export default Itens;
