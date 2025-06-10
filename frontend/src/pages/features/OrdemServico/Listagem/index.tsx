import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrButton, BrCard } from '@govbr-ds/react-components';
import { Paper, Box, Typography, Grid } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import { calcularPrazo, calcularTipo, corPorPrioridade } from '../functions';
import type { OrdemServico } from '../types/OrdemServico';

const CHAVE_STORAGE = 'sistema_os';

const Listagem = () => {
  const [listaOS, setListaOS] = useState<OrdemServico[]>([]);
  const navegar = useNavigate();

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

  const estiloCard: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #DFE3E8',
    borderRadius: '4px',
  };

  const estiloCabecalho = {
    padding: '16px',
    borderBottom: '1px solid #DFE3E8',
    backgroundColor: '#F8F9FA',
  };

  const estiloConteudo = {
    padding: '16px',
    flexGrow: 1,
  };

  const estiloAcoes = {
    padding: '12px 16px',
    borderTop: '1px solid #DFE3E8',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#F8F9FA',
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
        <Grid container spacing={3}>
          {listaOS.map((os) => (
            <Grid key={os.id}>
              <BrCard style={estiloCard}>
                <Box style={estiloCabecalho}>
                  <Typography
                    variant='h6'
                    component='div'
                    sx={{
                      fontWeight: 'bold',
                      color: '#005A9C',
                      fontSize: '1.1rem',
                    }}>
                    OS: {os.identificacao.numeroOS || os.id}
                  </Typography>
                  {os.identificacao.dataEmissao && (
                    <Typography
                      variant='caption'
                      display='block'
                      sx={{ color: '#5E6E80' }}>
                      Emitida em: {os.identificacao.dataEmissao}
                    </Typography>
                  )}
                </Box>

                <Box style={estiloConteudo}>
                  <Typography
                    variant='subtitle1'
                    component='p'
                    gutterBottom
                    sx={{
                      fontWeight: 500,
                      color: '#212529',
                      minHeight: '48px',
                    }}>
                    {os.identificacao.objetoContrato ||
                      'Objeto não especificado'}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 2,
                      marginBottom: 2,
                    }}>
                    <Typography
                      variant='body2'
                      sx={{ marginRight: 1, fontWeight: 500, color: '#333' }}>
                      Status:
                    </Typography>
                    {os.status}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1,
                      mb: 1,
                    }}>
                    <Typography
                      variant='body2'
                      sx={{ marginRight: 1, fontWeight: 500, color: '#333' }}>
                      Prioridade:
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        height: '8px',
                        backgroundColor: '#E9ECEF',
                        borderRadius: '4px',
                        position: 'relative',
                      }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          height: '100%',
                          width: `${(os.gutScore / 125) * 100}%`,
                          minWidth: os.gutScore > 0 ? '2%' : '0',
                          backgroundColor: corPorPrioridade(os.gutScore),
                          borderRadius: '4px',
                        }}
                      />
                    </Box>
                  </Box>

                  {os.itens && os.itens.length > 0 && (
                    <Typography variant='body2' sx={{ color: '#5E6E80' }}>
                      {os.itens.length} item(ns) na OS.
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}>
                    <div>
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 500, mr: 1 }}>
                        {os.udp ?? '-'} {calcularTipo(os)}
                      </Typography>
                    </div>
                    <Typography variant='body2'>
                      {calcularPrazo(os) ?? '-'} dias úteis
                    </Typography>
                  </div>
                </Box>

                <Box style={estiloAcoes}>
                  <BrButton
                    type='button'
                    size='small'
                    onClick={() => detalharOS(os.id)}>
                    <VisibilityIcon
                      fontSize='small'
                      sx={{ mr: 0.5, verticalAlign: 'middle' }}
                    />{' '}
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
                    />{' '}
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
                    />{' '}
                    Avaliar
                  </BrButton>
                </Box>
              </BrCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Listagem;
