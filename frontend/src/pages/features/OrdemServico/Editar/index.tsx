import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cadastrar from '../components/Cadastrar';
import type { IdentificacaoData } from '../components/Identificacao';
import type { Item } from '../components/Itens';
import type { DadosCronogramaType } from '../components/Cronograma';
import type { OrdemServico } from '../Listagem';

const STORAGE_KEY = 'sistema_os';

const OsEditar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [os, setOs] = useState<OrdemServico | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/os');
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      navigate('/os');
      return;
    }
    const lista: OrdemServico[] = JSON.parse(stored);
    const osEncontrada = lista.find((o) => o.id === id);
    if (!osEncontrada) {
      navigate('/os');
      return;
    }
    setOs(osEncontrada);
    setLoading(false);
  }, [id, navigate]);

  const handleSalvar = (dados: {
    identificacao: IdentificacaoData;
    itens: Item[];
    cronograma: DadosCronogramaType;
    instrucoes?: string;
  }) => {
    if (!os) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const lista: OrdemServico[] = JSON.parse(stored);
    const novaLista = lista.map((o) =>
      o.id === id
        ? {
            ...o,
            identificacao: dados.identificacao,
            itens: dados.itens,
            cronograma: dados.cronograma,
            instrucoes: dados.instrucoes,
          }
        : o
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
    navigate('/os');
  };

  if (loading) return <p>Carregando OS para edição...</p>;

  return (
    <div>
      <h2>Editar OS Nº {os?.identificacao.numeroOS || os?.id}</h2>
      {os && (
        <Cadastrar
          identificacao={os.identificacao}
          itens={os.itens}
          cronograma={os.cronograma}
          instrucoes={os.instrucoes}
          onSubmit={handleSalvar}
        />
      )}
    </div>
  );
};

export default OsEditar;
