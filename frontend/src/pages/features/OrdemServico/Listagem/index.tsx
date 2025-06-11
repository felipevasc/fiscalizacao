import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrButton } from '@govbr-ds/react-components'; // Removed BrTable
import { Paper, Box, Typography } from '@mui/material';
import Table from '../../../../components/Table'; // Added Table import

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import { rotuloPorPrioridade } from '../functions';
import type { OrdemServico } from '../types/OrdemServico';

const CHAVE_STORAGE = 'sistema_os';

const Listagem = () => {
  const [listaOS, setListaOS] = useState<OrdemServico[]>([]);
  const navegar = useNavigate();

  // groupOSByUnidade function removed

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
        <Table
          columns={[
            { header: 'Unidade de Origem', accessor: 'unidadeOrigem' },
            { header: 'Número da OS', accessor: 'numeroOS' },
            { header: 'Status', accessor: 'status' },
            { header: 'Prioridade Prevista', accessor: 'prioridade' },
            { header: 'Ações', accessor: 'acoes' },
          ]}
          data={listaOS
            .sort((a, b) =>
              a.identificacao.unidade > b.identificacao.unidade ? 1 : -1
            )
            .map((os) => ({
              id: os.id, // Keep id for keying if needed, though Table component uses rowIndex
              unidadeOrigem:
                os.identificacao.unidade || 'Unidade Não Especificada',
              numeroOS: os.identificacao.numeroOS || os.id,
              status: os.status,
              prioridade: `${rotuloPorPrioridade(os.gutScore)} (${
                os.gutScore
              })`,
              acoes: (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <BrButton
                    type='button'
                    size='small'
                    onClick={() => detalharOS(os.id)}>
                    <VisibilityIcon
                      fontSize='small'
                      sx={{ mr: 0.5, verticalAlign: 'middle' }}
                    />
                  </BrButton>
                  <BrButton
                    type='button'
                    size='small'
                    onClick={() => editarOS(os.id)}>
                    <EditIcon
                      fontSize='small'
                      sx={{ mr: 0.5, verticalAlign: 'middle' }}
                    />
                  </BrButton>
                  <BrButton
                    type='button'
                    size='small'
                    onClick={() => avaliarOS(os.id)}>
                    <AnalyticsIcon
                      fontSize='small'
                      sx={{ mr: 0.5, verticalAlign: 'middle' }}
                    />
                  </BrButton>
                </Box>
              ),
            }))}
        />
      )}
    </Box>
  );
};

export default Listagem;
