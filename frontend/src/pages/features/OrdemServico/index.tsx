import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Cadastrar from './components/Cadastrar';
import type { OrdemServico as TipoOrdemServico } from './types/OrdemServico';
import type { StatusOrdemServico } from './types/StatusOrdemServico';
import osIniciais from '../../../assets/OS_TR.json';

const CHAVE_STORAGE = 'sistema_os';

type OrdemServicoProps = {
  avaliar?: boolean;
};

const OrdemServico: React.FC<OrdemServicoProps> = ({ avaliar }) => {
  const { id } = useParams<{ id: string }>();
  const navegar = useNavigate();

  const [osEditar, setOsEditar] = useState<TipoOrdemServico | undefined>(
    undefined
  );
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const armazenado = localStorage.getItem(CHAVE_STORAGE);
    if (!armazenado) {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(osIniciais));
    }
  }, []);

  useEffect(() => {
    if (id) {
      const armazenado = localStorage.getItem(CHAVE_STORAGE);
      if (armazenado) {
        try {
          const lista: TipoOrdemServico[] = JSON.parse(armazenado);
          const encontrada = lista.find((os) => os.id === id);
          if (encontrada) {
            setOsEditar(encontrada);
          } else {
            alert('Ordem de Serviço não encontrada');
            navegar('/os'); // Redireciona caso não encontre a OS
          }
        } catch {
          alert('Erro ao carregar dados');
          navegar('/os');
        }
      } else {
        alert('Nenhuma OS cadastrada');
        navegar('/os');
      }
    }
    setCarregando(false);
  }, [id, navegar]);

  const salvarOS = (
    dados: Omit<TipoOrdemServico, 'id'> & { status: StatusOrdemServico }
  ) => {
    const armazenado = localStorage.getItem(CHAVE_STORAGE);
    let lista: TipoOrdemServico[] = armazenado ? JSON.parse(armazenado) : [];

    if (id && osEditar) {
      lista = lista.map((os) => (os.id === id ? { ...os, ...dados, id } : os));
    } else {
      const novoId = Date.now().toString();
      lista.push({ ...dados, id: novoId, status: dados.status || 'Nova' });
    }

    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
    navegar('/os');
  };

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return (
    <Cadastrar osEditar={osEditar} onSubmit={salvarOS} avaliar={avaliar} />
  );
};

export default OrdemServico;
