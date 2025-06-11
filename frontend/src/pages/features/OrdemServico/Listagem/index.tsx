import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrButton, BrCard, BrTable } from '@govbr-ds/react-components';
import { Paper, Box, Typography, Grid } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import {
  calcularPrazo,
  calcularTipo,
  corPorPrioridade,
  rotuloPorPrioridade,
} from '../functions';
import type { OrdemServico } from '../types/OrdemServico';

const CHAVE_STORAGE = 'sistema_os';

const Listagem = () => {
  const [listaOS, setListaOS] = useState<OrdemServico[]>([]);
  const navegar = useNavigate();

  const groupOSByUnidade = (
    lista: OrdemServico[],
  ): Record<string, OrdemServico[]> => {
    return lista.reduce(
      (acc, os) => {
        const unidade = os.udp || 'Unidade Não Especificada';
        if (!acc[unidade]) {
          acc[unidade] = [];
        }
        acc[unidade].push(os);
        return acc;
      },
      {} as Record<string, OrdemServico[]>,
    );
  };

  useEffect(() => {
    const armazenado = localStorage.getItem(CHAVE_STORAGE);
    if (armazenado) {
      setListaOS(JSON.parse(armazenado));
    }
  }, []);

  const detalharOS = (id: string | undefined) => {
    if (!id) return;
    navegar(`/os/detalhar/${id}`);
  };

  const editarOS = (id: string | undefined) => {
    if (!id) return;
    navegar(`/os/editar/${id}`);
  };

  const avaliarOS = (id: string | undefined) => {
    if (!id) return;
    navegar(`/os/avaliar/${id}`);
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: { xs: 2, md: 3 },
        backgroundColor: '#EBF0F5',
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
          paddingBottom: 2,
          borderBottom: '1px solid #CDD4DB',
        }}>
        <Typography
          variant='h4'
          component='h1'
          sx={{ fontWeight: 600, color: '#1F4C73' }}>
          Ordens de Serviço
        </Typography>
        <BrButton
          primary={true}
          onClick={() => (window.location.href = '/os/cadastrar')}>
          Cadastrar Nova OS
        </BrButton>
      </Box>

      {listaOS.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            padding: { xs: 3, md: 4 },
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
          }}>
          <Typography
            variant='h6'
            component='p'
            gutterBottom
            sx={{ color: '#333333', fontWeight: 500 }}>
            Nenhuma Ordem de Serviço Encontrada
          </Typography>
          <Typography
            variant='body1'
            sx={{ color: '#555555', marginBottom: 3 }}>
            Para começar, cadastre uma nova ordem de serviço.
          </Typography>
          <BrButton
            primary={true}
            onClick={() => (window.location.href = '/os/cadastrar')}>
            Cadastrar Primeira OS
          </BrButton>
        </Paper>
      ) : (
        <BrTable>
          <BrTable.Head>
            <BrTable.Row>
              <BrTable.Cell header={true}>Número da OS</BrTable.Cell>
              <BrTable.Cell header={true}>Status</BrTable.Cell>
              <BrTable.Cell header={true}>Prioridade Prevista</BrTable.Cell>
              <BrTable.Cell header={true}>Ações</BrTable.Cell>
            </BrTable.Row>
          </BrTable.Head>
          <BrTable.Body>
            {Object.entries(groupOSByUnidade(listaOS)).map(
              ([unidadeNome, osPorUnidade]) => (
                <>
                  <BrTable.Row key={`${unidadeNome}-header`}>
                    <BrTable.Cell
                      header={true}
                      colSpan={4} /* Adjusted colSpan to 4 */
                      style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                      {unidadeNome} (Unidade de Origem)
                    </BrTable.Cell>
                  </BrTable.Row>
                  {osPorUnidade.map((os) => (
                    <BrTable.Row key={os.id}>
                      <BrTable.Cell>
                        {os.identificacao.numeroOS || os.id}
                      </BrTable.Cell>
                      <BrTable.Cell>{os.status}</BrTable.Cell>
                      <BrTable.Cell>
                        {rotuloPorPrioridade(os.gutScore)} ({os.gutScore})
                      </BrTable.Cell>
                      <BrTable.Cell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}> {/* Reduced gap slightly */}
                          <BrButton
                            type='button'
                            size='small'
                            onClick={() => detalharOS(os.id)}>
                            <VisibilityIcon
                              fontSize='small'
                              sx={{ mr: 0.5, verticalAlign: 'middle' }}
                            />
                            Detalhar
                          </BrButton>
                          <BrButton
                            type='button'
                            size='small'
                            secondary={true}
                            onClick={() => editarOS(os.id)}>
                            <EditIcon
                              fontSize='small'
                              sx={{ mr: 0.5, verticalAlign: 'middle' }}
                            />
                            Editar
                          </BrButton>
                          <BrButton
                            type='button'
                            size='small'
                            secondary={true}
                            onClick={() => avaliarOS(os.id)}>
                            <EditIcon
                              fontSize='small'
                              sx={{ mr: 0.5, verticalAlign: 'middle' }}
                            />
                            Avaliar
                          </BrButton>
                        </Box>
                      </BrTable.Cell>
                    </BrTable.Row>
                  ))}
                </>
              ),
            )}
          </BrTable.Body>
        </BrTable>
      )}
    </Box>
  );
};

export default Listagem;
